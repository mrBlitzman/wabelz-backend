import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
  customer_details: {
    name_surname: { type: String, required: true },
    mail_addr: { type: String, required: true },
    country: { type: String, required: true },
    phone_num: { type: String, required: true },
    industry: { type: String, required: true },
  },
  order_details: {
    total_price: { type: Number, required: true },
    website: {
      type: { type: String, required: true },
      prior_goal: { type: String, required: true },
      short_desc: { type: String, required: true },
      note: { type: String, required: false },
    },
    products: [
      { type: Object }
    ]
  },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
