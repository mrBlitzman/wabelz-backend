import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true },
    tagline: { type: String, required: true },
    subtitle: { type: String, required: true },
    price: [
        {
            currency: { type: String, required: true },
            amount: { type: Number, required: true }
        }
    ],
    oldPrice: [
        {
            currency: { type: String, required: true },
            amount: { type: Number, required: true }
        }
    ],
    features: [
        {
          name: { type: String, required: true },
          includeType: { type: String, required: true },
        },
      ],
      description: { type: String, required: true },
      videoUrl: { type: String, required: true }
  });

  const Package = mongoose.model('Package', packageSchema);

export default Package;