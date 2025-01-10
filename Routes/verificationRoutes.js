import express from 'express';
import bcrypt from 'bcrypt';
import VerificationCode from "../Models/Schemas/verificationCodes.js";
import Order from "../Models/Schemas/orders.js";
import validateOrder from "../Models/Services/validateOrder.js";
import mailer from "../Models/Services/mailer.js";
import rateLimit from "express-rate-limit";
import axios from "axios";

const router = express.Router();

const verifyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {process: "too_much_requests", message: "Too much requests. Try again later."}
});

router.post('/verification/:slug', verifyLimiter, async (req, res) => {
  const slug = req.params.slug;

  switch(slug) {
    case "verifyEmail":
      const { email, code } = req.body;
      const formData = req.body.form;
      const productData = req.body.products;
      try {
        const validateOrderData = await validateOrder(formData, productData);
        const errors = validateOrderData.errors;
        if (Object.keys(errors).length > 0) {
          return res.status(200).json({ success: false, errors });
        }

        if (!/^[0-9]{6}$/.test(code)) {
          return res.status(400).json({ success: false, process: 'invalid_code' });
        }

        const verificationRecord = await VerificationCode.findOne({ email });
        if (!verificationRecord) {
          return res.status(404).json({ success: false, process: 'email_did_not_found' });
        }

        const isMatch = await bcrypt.compare(code, verificationRecord.code);
        if (!isMatch) {
          return res.status(400).json({ success: false, process: 'code_did_not_match' });
        }

        await VerificationCode.deleteOne({ email });

        const newOrder = {
          customer_details: {
            name_surname: validateOrderData.safeForm.name,
            mail_addr: validateOrderData.safeForm.email,
            country: validateOrderData.safeForm.country,
            phone_num: validateOrderData.safeForm.phone,
            industry: validateOrderData.safeForm.industry
          },
          order_details:{
            total_price:validateOrderData.order.totalPrice,
            website: {
              type: validateOrderData.safeForm.websiteType,
              prior_goal: validateOrderData.safeForm.goal,
              short_desc: validateOrderData.safeForm.description,
              note: validateOrderData.safeForm.additionalNote
            },
            products: validateOrderData.order.orderDetails.map(item => ({
              ...item
            }))
          }
        }

        if (formData.emailList === true) {  
          const emailToRegister = formData.email;
          try {
              await axios.post(`${process.env.API_ORIGIN}/api/auth/registerEmail`, { email: emailToRegister });
          } catch (error) {
          }
        }
      

        const createdOrder = await Order.create(newOrder);

        const orderDetailsMail = await mailer("orderDetails", {validateOrderData, formData}, res);
        const newOrderRecievedMail = await mailer("newOrderRecieved", {validateOrderData}, res);

        return createdOrder && orderDetailsMail && newOrderRecievedMail ? res.status(200).json({ success: true, message: 'verificated' }) : res.status(500).json({ success: false, message: "order couldn't created" });

        if (res.headersSent) {
            return;
        }

      } catch (err) {
        return res.status(500).json({ message: 'server_error', error: err.message });
      }
    
      break;

  }
});

export default router;
