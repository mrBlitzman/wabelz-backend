import express from 'express';
import bcrypt from 'bcrypt';
import VerificationCode from "../Models/Schemas/verificationCodes.js";
import Order from "../Models/Schemas/orders.js";
import validateOrder from "../Models/Services/validateOrder.js";
import nodemailer from "nodemailer";
const logo = "https://wabelzapi.fly.dev/Assets/Icons/wabelz-logo.png";

const router = express.Router();

router.post('/verification/:slug', async (req, res) => {
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
            name_surname: formData.name,
            mail_addr: formData.email,
            country: formData.country,
            phone_num: formData.phone,
            industry: formData.industry
          },
          order_details:{
            total_price:validateOrderData.order.totalPrice,
            website: {
              type: formData.websiteType,
              prior_goal: formData.goal,
              short_desc: formData.description,
              note: formData.additionalNote
            },
            products: validateOrderData.order.orderDetails.map(item => ({
              ...item
            }))
          }
        }
        const createdOrder = await Order.create(newOrder);
        const customerMailOptions = {
          from: process.env.TRANSPORTER_MAIL,
          to: formData.email,
          subject: "Order Recieved - Wabelz",
          html: `
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Order Received</title>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #000010;
                        color: #fff;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                      }

                        .container {
                          width: 100%;
                          background-color: #1b2b4d;
                          border-radius: 8px;
                        }
                        .container .content {
                          padding: 20px;
                          max-width: 600px;
                          margin: 0 auto;
                        }

                      h1 {
                        color: #dec4ff;
                        text-align: center;
                      }

                      p {
                        color: #fff;
                        line-height: 1.6;
                      }

                      .order-details {
                        background-color: #222;
                        padding: 15px;
                        border-radius: 8px;
                        margin-top: 20px;
                      }

                      .order-details p {
                        margin: 5px 0;
                      }

                      .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #8c8cec;
                      }

                      .total {
                          margin-top: 20px;
                          font-size: 1.2em;
                          font-weight: bold;
                          color: #ffd700;
                          text-align: center;
                        }

                        table {
                          width: 100%;
                          border-collapse: collapse;
                        }
                        table th,
                        table td {
                          padding: 8px;
                          border: 1px solid #8c8cec;
                          text-align: center;
                          color: #fff;
                        }
                          
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="content">
                        <h1>Order Received</h1>
                        <p>Dear ${validateOrderData.safeForm.name},</p>
                        <p>We have successfully received your order. Our team will contact you shortly to schedule a live meeting where we will discuss the details and design of your project.</p>
                        <p>Please note that payment will be made via bank transfer (IBAN) after the meeting.</p>
                        <div class="order-details">
                          <p>
                            <strong>Your Products:</strong>
                          </p> 
                          <table>
                                <thead>
                                  <tr>
                                    <th style="text-align: left">Title</th>
                                    <th>Unit Price</th>
                                    <th>Quantity</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  ${validateOrderData.order.orderDetails
                                    .map(
                                      (item) => `
                                    <tr>
                                      <td style="text-align: left">${item.invoiceTitle}</td>
                                      <td>$${item.price}</td>
                                      <td>${item.quantity}</td>
                                    </tr>
                                  `
                                    )
                                    .join('')}
                                </tbody>
                              </table>
                        </div>
                        <p class="total">Total: $${validateOrderData.order.totalPrice}</p>
                        <div class="footer">
                          <p>Thank you for choosing Wabelz. We look forward to working with you!</p>
                          <img src="${logo}" alt="Wabelz Logo"
                          style="
                            display: block;
                            margin: 4rem auto;
                            max-width: 100px;
                            height: auto;
                          ">
                        </div>
                      </div>
                    </div>
                  </body>
                </html>

                `};
        const teamMailOptions = {
          from: process.env.TRANSPORTER_MAIL,
          to: "aliravzabarlak@gmail.com",
          subject: "New Order - Wabelz",
          html: `
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>New Order</title>
                    <style>
                      body {
                        font-family: Arial, sans-serif;
                        background-color: #000010;
                        color: #fff;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                      }

                      .container {
                          width: 100%;
                          background-color: #1b2b4d;
                          border-radius: 8px;
                        }
                        .container .content {
                          padding: 20px;
                          max-width: 600px;
                          margin: 0 auto;
                        }

                      h1 {
                        color: #dec4ff;
                        text-align: center;
                      }

                      p {
                        color: #fff;
                        line-height: 1.6;
                      }

                      .section-title {
                        font-weight: bold;
                        margin-top: 20px;
                      }

                      .order-details,
                      .customer-info {
                        background-color: #222;
                        padding: 15px;
                        border-radius: 8px;
                        margin-top: 20px;
                      }

                      .order-details p,
                      .customer-info p {
                        margin: 5px 0;
                      }

                      .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #8c8cec;
                      }

                      .total {
                        margin-top: 20px;
                        font-size: 1.2em;
                        font-weight: bold;
                        color: #ffd700;
                        text-align: center;
                      }

                      table {
                        width: 100%;
                        border-collapse: collapse;
                      }
                      table th,
                      table td {
                        padding: 8px;
                        border: 1px solid #8c8cec;
                        text-align: center;
                        color: #fff;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="content">
                        <h1>New Order Received</h1>
                        <p>A new order has been received from Wabelz. Please review the customer and order details below:</p>
                        <div class="customer-info">
                          <p class="section-title">Customer Information:</p>
                          <p>
                            <strong>Name:</strong> ${validateOrderData.safeForm.name}
                          </p>
                          <p>
                            <strong>Email:</strong> ${validateOrderData.safeForm.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> ${validateOrderData.safeForm.phone}
                          </p>
                          <p>
                            <strong>Country:</strong> ${validateOrderData.safeForm.country}
                          </p>
                          <p>
                            <strong>Industry:</strong> ${validateOrderData.safeForm.industry}
                          </p>
                        </div>
                        <div class="order-details">
                          <p class="section-title">Order Information:</p>
                          <p>
                            <strong>Website Type:</strong> ${validateOrderData.safeForm.websiteType}
                          </p>
                          <p>
                            <strong>Goal:</strong> ${validateOrderData.safeForm.goal}
                          </p>
                          <p>
                            <strong>Description:</strong> ${validateOrderData.safeForm.description}
                          </p>
                          ${validateOrderData.safeForm.additionalNote &&
                            `<p>
                              <strong>Additional Notes:</strong> ${validateOrderData.safeForm.additionalNote}
                            </p>`
                          }
                        </div>
                        <div class="order-details">
                          <p>
                            <strong>Your Products:</strong>
                          </p> 
                          <table>
                              <thead>
                                <tr>
                                  <th style="text-align: left">Title</th>
                                  <th>Unit Price</th>
                                  <th>Quantity</th>
                                </tr>
                              </thead>
                              <tbody>
                                ${validateOrderData.order.orderDetails
                                  .map(
                                    (item) => `
                                  <tr>
                                    <td style="text-align: left">${item.invoiceTitle}</td>
                                    <td>$${item.price}</td>
                                    <td>${item.quantity}</td>
                                  </tr>
                                `
                                  )
                                  .join('')}
                              </tbody>
                          </table>
                        </div>
                        <p class="total">Total: $${validateOrderData.order.totalPrice}</p>
                        <div class="footer">
                          <p>Thank you for your attention. Please process the order accordingly.</p>
                          <img src="${logo}" alt="Wabelz Logo"
                          style="
                            display: block;
                            margin: 4rem auto;
                            max-width: 100px;
                            height: auto;
                          "
                          >
                        </div>
                      </div>
                    </div>
                  </body>
                </html>
                `};

                const transporter = nodemailer.createTransport({
                  service: 'gmail',
                  auth: {
                    user: process.env.TRANSPORTER_MAIL,
                    pass: process.env.TRANSPORTER_PASSWORD
                  }
                });

                transporter.sendMail(customerMailOptions, async (error, info) => {
                  if (error) {
                    return res.status(500).json({ success: false, message: `Error occurred while sending order details to customer: ${error}` });
                  }
                });
                transporter.sendMail(teamMailOptions, async (error, info) => {
                  if (error) {
                    return res.status(500).json({ success: false, message: `Error occurred while sending order details to team: ${error}` });
                  }
                });

                return createdOrder ? res.status(200).json({ success: true, message: 'verificated' }) : res.status(500).json({ success: false, message: "order couldn't created" });
        

                if (res.headersSent) {
                    return;
                }

      } catch (err) {
        return res.status(500).json({ message: 'server_error', error: err.message });
      }
  }
});

  

export default router;
