import returnMailOptions from "./mailOptions.js";
import nodemailer from "nodemailer";

export default function mailer(
  mailOption,
  infos,
  res,
  functionAfterSent,
  functionAfterSentParams
) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.TRANSPORTER_MAIL,
        pass: process.env.TRANSPORTER_PASSWORD,
      },
    });

    const mailOptions = returnMailOptions(mailOption, infos);

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        reject({
          success: false,
          message: `Error occurred while sending mail: ${error}`,
        });
      } else {
        if (functionAfterSent) {
          try {
            await functionAfterSent(functionAfterSentParams, res);
            resolve(true);
          } catch (err) {
            reject({
              success: false,
              message: `Error in functionAfterSent: ${err.message}`,
            });
          }
        } else {
          resolve(true);
        }
      }
    });
  });
}
