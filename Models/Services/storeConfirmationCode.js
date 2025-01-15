import VerificationCode from "../Schemas/verificationCodes.js";
import bcrypt from "bcrypt";

export default async function storeConfirmationCode(params, res) {
  try {
    const { token, email } = params;
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(token, salt);

    const oldCode = await VerificationCode.findOne({ email });

    !oldCode && (await VerificationCode.deleteOne({ email }));

    const codeDocument = new VerificationCode({
      code: hashedCode,
      email: email,
    });
    await codeDocument.save();

    res.send({
      mailSent: true,
      success: true,
      message: "Validation passed and verification mail sent.",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: `Error occurred: ${err.message}` });
  }
}
