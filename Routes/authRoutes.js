import express from "express";
import rateLimit from "express-rate-limit";
import EmailList from "../Models/Schemas/emailList.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 3,
  message: "Too much requests. Try again later.",
});

router.post("/auth/:slug", authLimiter, async (req, res) => {
  const slug = req.params.slug;

  switch (slug) {
    case "registerEmail":
      const { email } = req.body;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!email) {
        return res.status(400).json({ message: "Email is required." });
      } else if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      try {
        const existingEmail = await EmailList.findOne({ email });

        if (existingEmail) {
          if (existingEmail.delisted) {
            await EmailList.updateOne({ email }, { delisted: false });
            return res.status(200).json({ message: "Email is reactivated." });
          }
          return res
            .status(400)
            .json({ message: "Email is already registered." });
        }

        const newEmail = await EmailList.create({ email });
        return res.status(200).json({ message: "Registration successful." });
      } catch (error) {
        console.error("Error registering email:", error);
        return res
          .status(500)
          .json({ message: "An error occurred. Please try again later." });
      }
      break;

    case "delistEmail":
      const { emailToDelist } = req.body;

      if (!emailToDelist) {
        return res.send("<h1>Email is required.</h1>");
      }

      try {
        const existingEmail = await EmailList.findOne({ email: emailToDelist });
        if (!existingEmail) {
          return res.send("<h1>Email not found.</h1>");
        }

        await EmailList.updateOne({ email: emailToDelist }, { delisted: true });
        return res.send("<h1>Email has been delisted successfully.</h1>");
      } catch (error) {
        console.error("Error delisting email:", error);
        return res.send("<h1>An error occurred. Please try again later.</h1>");
      }
      break;
  }
});

router.get("/auth/delistEmail", async (req, res) => {
  const { email, token } = req.query;

  if (!email || !token) {
    return res.send("<h1>Invalid request.</h1>");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.email !== email) {
      return res.send("<h1>Unauthorized request.</h1>");
    }

    const existingEmail = await EmailList.findOne({ email });
    if (!existingEmail) {
      return res.send("<h1>Email not found.</h1>");
    }

    if (existingEmail.delisted) {
      return res.send(
        "<h1>You are already unsubscribed. You are not a subscriber.</h1>"
      );
    }

    await EmailList.updateOne({ email }, { delisted: true });
    return res.send(
      "<h1>Your email has been unsubscribed successfully. Thank you!</h1>"
    );
  } catch (error) {
    console.error("Error during token verification:", error);
    return res.send("<h1>An error occurred. Please try again later.</h1>");
  }
});

export default router;
