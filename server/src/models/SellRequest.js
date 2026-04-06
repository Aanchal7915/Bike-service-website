const mongoose = require('mongoose');

const sellRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    kmDriven: { type: Number, required: true },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: true,
    },
    engineCC: { type: Number },
    fuelType: { type: String, enum: ['petrol', 'electric', 'hybrid'], default: 'petrol' },
    color: String,
    registrationNumber: String,
    description: String,
    images: [{ type: String }],
    videos: [{ type: String }],
    askingPrice: { type: Number },
    estimatedPrice: { type: Number },
    isOneHourSell: { type: Boolean, default: false },
    pickupAddress: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'under_review',
        'approved',
        'rejected',
        'pickup_scheduled',
        'sold',
        'cancelled',
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
    adminNote: String,
    offeredPrice: { type: Number },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'paid'],
      default: 'pending',
    },
    paymentTransactionId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellRequest', sellRequestSchema);
