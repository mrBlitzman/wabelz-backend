import express from 'express';
import bcrypt from 'bcrypt';
import VerificationCode from "../Models/Schemas/verificationCodes.js";
import validateOrder from "../Models/Services/validateOrder.js";

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
        return res.status(200).json({ success: true, message: 'verificated' });

        if (res.headersSent) {
            return;
        }

      } catch (err) {
        return res.status(500).json({ message: 'server_error', error: err.message });
      }
  }
});

  

export default router;
