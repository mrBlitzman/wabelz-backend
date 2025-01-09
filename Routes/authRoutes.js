import express from "express";
import rateLimit from "express-rate-limit";
import EmailList from "../Models/Schemas/emailList.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "Too much requests. Try again later."
});

router.post("/auth/:slug", authLimiter, async (req, res) => {
    const slug = req.params.slug;

    switch(slug){
        case "mailRegistry":
            const { email } = req.body;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (!email) {
                return res.status(400).json({ message: 'Email is required.' });
            } else if (!emailRegex.test(email)){
                return res.status(400).json({ message: 'Invalid email format.' });
            }

            try {
                const existingEmail = await EmailList.findOne({ email });
                if (existingEmail) {
                  return res.status(400).json({ message: 'Email is already registered.' });
                }

                const newEmail = await EmailList.create( {email} );
            
                res.status(200).json({ message: 'Registration successful.' });
              } catch (error) {
                console.error('Error registering email:', error);
                res.status(500).json({ message: 'An error occurred. Please try again later.' });
              }
    }
});

export default router;