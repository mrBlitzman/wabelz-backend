import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const AutoIncrement = AutoIncrementFactory(mongoose);

const PricingSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  type: {
    type: String,
    required: true,
    enum: ['package', 'extra', 'item'],
  },
  price: { type: Number, required: true },
  invoiceTitle: { type: String },
  // `package` türü için alanlar
  title: { type: String, required: function () { return this.type === 'package'; } },
  invoiceTitle: { type: String, required: function () { return this.type === 'package'; } },
  slug: { type: String, required: function () { return this.type === 'package'; }},
  tagline: { type: String, required: function () { return this.type === 'package'; } },
  subtitle: { type: String, required: function () { return this.type === 'package'; } },
  oldPrice: {
    type: [
        { type: Number, required: true }
    ],
    required: function () { return this.type === 'package'; },
  },
  features: {
    type: [
      {
        name: { type: String, required: true },
        includeType: { type: String, required: true },
        featureKey: { type: String, required: true }
      },
    ],
    required: function () { return this.type === 'package'; },
  },
  description: { type: String, required: function () { return this.type === 'package'; } },
  videoUrl: { type: String, required: function () { return this.type === 'package'; } },
  // `extra` türü için alanlar
  name: { type: String, required: function () { return this.type === 'extra'; } },
  featureKey: { type: String, required: function () { return this.type === 'extra'; } },
  // `item` türü için alanlar şu an boş, ileride genişletilebilir
});

// Auto-increment ayarlarını ekle
PricingSchema.plugin(AutoIncrement, { inc_field: 'id' });

export default mongoose.model('Pricing', PricingSchema);
