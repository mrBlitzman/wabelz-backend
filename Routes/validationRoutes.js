import express from "express";
import validateOrder from "../Models/Services/validateOrder.js";
import nodemailer from "nodemailer";
import { authenticator } from 'otplib';
import VerificationCode from "../Models/Schemas/verificationCodes.js";
import bcrypt from 'bcrypt';
const logo = "https://wabelzapi.fly.dev/Assets/Icons/wabelz-logo.png";

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.TRANSPORTER_MAIL,
      pass: process.env.TRANSPORTER_PASSWORD
    }
});

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
            
            const mailOptions = {
                from: process.env.TRANSPORTER_MAIL,
                to: formData.email,
                subject: "Order Confirmation",
                html: `
                  <!DOCTYPE html>
                  <html lang="en">
                    <head>
                      <meta charset="UTF-8" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                      <title>Wabelz Order Confirmation</title>
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
                        .total {
                          margin-top: 20px;
                          font-size: 1.2em;
                          font-weight: bold;
                          color: #ffd700;
                          text-align: center;
                        }
                        .verification-code {
                          margin: 40px 60px;
                          padding: 10px;
                          background-color: #8c8cec;
                          text-align: center;
                          font-size: 1.1em;
                          border-radius: 5px;
                          color: #000010;
                        }
                        .verification-code p {
                          margin-bottom: 0;
                        }
                        .verification-code h2 {
                          margin-top: 1rem;
                          font-size: 3rem;
                        }
                        .footer {
                          margin-top: 40px;
                          text-align: center;
                          color: #8c8cec;
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

                        @media (max-width: 768px) {
                          .verification-code h2{
                          font-size: 2rem;
                          }

                          .verification-code {
                            margin: 40px 20px;
                          }
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <div class="content">
                          <h1>Order Confirmation</h1>
                          <p>Dear ${formData.name},</p>
                          <p>
                            Thank you for your order with Wabelz! We are excited to confirm that
                            your order has been successfully placed.
                          </p>
                          <div class="verification-code">
                            <p>Here is your verification code:</p>
                            <h2>${token}</h2>
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
                            <p>
                              Thank you for choosing Wabelz. We hope you enjoy your purchase!
                            </p>
                            <img
                              src="${logo}"
                              alt="Wabelz Logo"
                              style="
                                display: block;
                                margin: 4rem auto;
                                max-width: 100px;
                                height: auto;
                              "
                            />
                          </div>
                        </div>
                      </div>
                    </body>
                  </html>
                `
              };

              transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                  return res.status(500).json({ success: false, message: `Error occurred: ${error}` });
                }
              
                try {
                  const salt = await bcrypt.genSalt(10);
                  const hashedCode = await bcrypt.hash(token, salt);

                  const oldCode = await VerificationCode.findOne({ email: formData.email });

                  !oldCode && await VerificationCode.deleteOne({ email: formData.email });
              
                  const codeDocument = new VerificationCode({
                    code: hashedCode,
                    email: formData.email,
                  });
                  await codeDocument.save();
              
                  res.send({ mailSent: true, success: true, message: "Validation passed and verification mail sent." });
                } catch (err) {
                  res.status(500).json({ success: false, message: `Error occurred: ${err.message}` });
                }
              });
              
              
    }
});

export default router;