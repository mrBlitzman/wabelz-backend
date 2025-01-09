import mongoose from 'mongoose';

const emailListSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  registeredAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  delisted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const EmailList = mongoose.model('emailList', emailListSchema);

export default EmailList;