import express from "express";
import validateOrder from "../Models/Services/validateOrder.js";
import { authenticator } from 'otplib';
import mailer from "../Models/Services/mailer.js";
import storeConfirmationCode from "../Models/Services/storeConfirmationCode.js";

const router = express.Router();

router.post("/validation/:slug", async (req, res) => {
    const slug = req.params.slug;
    switch(slug){
        case "order":
            const formData = req.body.form;
            const productData = req.body.products;
            const validateOrderData = await validateOrder(formData, productData);
            const errors = validateOrderData.errors;
            if (Object.keys(errors).length > 0) {
                return res.status(200).json({ success: false, errors });
            }

            const secret = authenticator.generateSecret();
            const token = authenticator.generate(secret);
            const email = formData.email;

            await mailer("confirmationCode", { validateOrderData, formData, token }, res, storeConfirmationCode, { token, email });
    }
});

export default router;