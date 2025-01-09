import mongoose from 'mongoose';

const emailListAdminsSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const EmailListAdmins = mongoose.model('mailListAdmins', emailListAdminsSchema);

export default EmailListAdmins;
