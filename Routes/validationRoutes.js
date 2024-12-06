import express from "express";
import validateOrder from "../Models/Services/validateOrder.js";

const router = express.Router();

router.post("/validation/:slug", (req, res) => {
    const slug = req.params.slug;
    switch(slug){
        case "order":
            const orderData = req.body;
            const errors = validateOrder(orderData);

            if (Object.keys(errors).length > 0) {
                return res.status(400).json({ success: false, errors });
            }

            res.status(200).json({ success: true, message: "Validation passed." });
    }
});

export default router;