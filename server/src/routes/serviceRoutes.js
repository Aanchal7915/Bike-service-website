const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBooking, updateBookingStatus, getAllBookings, createServicePayment, verifyServicePayment } = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { adminOnly, mechanicOrAdmin } = require('../middleware/admin');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, mechanicOrAdmin, updateBookingStatus);
router.post('/:id/payment', protect, createServicePayment);
router.post('/:id/verify-payment', protect, verifyServicePayment);

module.exports = router;
