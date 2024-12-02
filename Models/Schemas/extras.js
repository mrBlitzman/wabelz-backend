import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const extraSchema = new Schema({
    name: { type: String, required: true },
    price: {
        currency: { type: String, required: true },
        amount: { type: Number, required: true }
    },
    featureKey: { type: String, required: true }
});

const Extra = mongoose.model('Extra', extraSchema);

export default Extra;
