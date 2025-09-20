import express from 'express';
import passport from 'passport';
import PaymentController from '../controllers/paymentController.js';
import setAuthHeader from '../middlewares/setAuthHeader.js';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';

const router = express.Router();

// Test route
router.get('/test', PaymentController.test);

// Payment success callback (no auth required - called by PayU)
router.post('/success', PaymentController.handlePaymentSuccess);

// Payment failure callback (no auth required - called by PayU)
router.post('/failure', PaymentController.handlePaymentFailure);

// Apply authentication middleware to protected routes
router.use(passport.authenticate('jwt', { session: false }));
router.use(accessTokenAutoRefresh);
router.use(setAuthHeader);

// Initialize payment
router.post('/initialize', PaymentController.initializePayment);

// Get payment status
router.get('/status/:txnid', PaymentController.getPaymentStatus);

export default router;
