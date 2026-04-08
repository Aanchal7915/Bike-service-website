const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bikeModel: { type: String, required: true },
    bikeBrand: { type: String, required: true },
    bikeYear: { type: Number },
    serviceType: { type: String, required: true },
    serviceLabel: { type: String },
    problemDescription: { type: String },
    isPickupDrop: { type: Boolean, default: false },
    isOneHourRepair: { type: Boolean, default: false },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      lat: Number,
      lng: Number,
    },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'requested',
    },
    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
    estimatedCost: { type: Number },
    finalCost: { type: Number },
    payment: {
      method: { type: String, enum: ['online', 'cod'], default: 'cod' },
      status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
      transactionId: String,
      advancePaid: { type: Number, default: 0 },
    },
    invoiceUrl: String,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema);
