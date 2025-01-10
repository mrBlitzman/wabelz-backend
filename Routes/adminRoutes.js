import express from "express";
import EmailList from "../Models/Schemas/emailList.js";
import EmailListAdmins from "../Models/Schemas/emailListAdmins.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
import rateLimit from "express-rate-limit";
import jwt from 'jsonwebtoken';

const router = express.Router();

const adminLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "Too much requests. Try again later."
});

router.post('/admin/:slug', adminLimiter, async (req, res) => {
    const slug = req.params.slug;

    switch(slug) {
        case "sendMassMail":
            const { username, password, subject, htmlMessage } = req.body;

            if (!username || !password || !subject || !htmlMessage) {
            return res.status(400).json({ message: 'Username, password, subject, and message are required.' });
            }
        
            try {
                const admin = await EmailListAdmins.findOne({ username });

                if (!admin) {
                    return res.status(401).json({ message: 'Invalid authentication credentials.' });
                }

                const isPasswordValid = await bcrypt.compare(password, admin.password);

                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Invalid authentication credentials.' });
                }
                  

                const emails = await EmailList.find({ delisted: false });
                if (emails.length === 0) {
                    return res.status(400).json({ message: 'No active emails found.' });
                }

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.TRANSPORTER_MAIL,
                        pass: process.env.TRANSPORTER_PASSWORD
                    }
                });

                

                const sendPromises = emails.map((email) => {
                    const unsubscribeToken = jwt.sign(
                        { email: email.email }, 
                        process.env.JWT_SECRET, 
                        { expiresIn: '7d' }
                    );
                
                    const unsubscribeLink = `${process.env.API_ORIGIN}/api/auth/delistEmail?email=${email.email}&token=${unsubscribeToken}`;
                    const personalizedMessage = htmlMessage.replace("{{unsubscribeLink}}", unsubscribeLink);
                
                    return transporter.sendMail({
                        from: process.env.TRANSPORTER_MAIL,
                        to: email.email,
                        subject,
                        html: personalizedMessage,
                    });
                });
                
                await Promise.all(sendPromises);
                
            
                res.status(200).json({ message: 'Emails sent successfully.' });
            } catch (error) {
                console.error('Error sending emails:', error);
                res.status(500).json({ message: 'An error occurred while sending emails.' });
            }

        break;
    }
});
  
  export default router;