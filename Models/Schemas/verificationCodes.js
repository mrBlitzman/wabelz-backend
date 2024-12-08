import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
    code: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Basit e-posta doğrulama regex'i
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        }
      },
    },
    expireAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 2 * 60 * 1000)
    },
  });

  verificationCodeSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

  const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

  export default VerificationCode;