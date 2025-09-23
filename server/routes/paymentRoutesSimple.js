import express from 'express';
import crypto from 'crypto';
import logger from '../config/logger.js';

const router = express.Router();

// PayU Money configuration
const payuConfig = {
  key: 'gtKFFx',
  salt: 'eCwWELxi',
  testUrl: 'https://test.payu.in/_payment',
  productionUrl: 'https://secure.payu.in/_payment'
};

// Generate PayU hash
const generatePayUHash = (data) => {
  try {
    const {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      salt
    } = data;

    // Create hash string in the format required by PayU
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
    
    // Generate SHA512 hash
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    logger.info('PayU hash generated successfully', { txnid, amount });
    return hash;
  } catch (error) {
    logger.error('Error generating PayU hash:', error);
    throw new Error('Failed to generate payment hash');
  }
};

// Simple test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Payment routes working',
    timestamp: new Date().toISOString()
  });
});

// Initialize payment for any form type
router.post('/initialize', (req, res) => {
  try {
    const {
      formType,
      formData,
      amount,
      userInfo
    } = req.body;

    // Validate required fields
    if (!formType || !formData || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment information: formType, formData, amount'
      });
    }

    // Generate transaction ID
    const txnid = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5)}`;

    // Prepare PayU data
    const payuData = {
      key: payuConfig.key,
      salt: payuConfig.salt,
      txnid: txnid,
      amount: amount,
      productinfo: `${formType} Form Submission`,
      firstname: userInfo?.name || formData?.name || formData?.trustName || 'User',
      email: userInfo?.email || 'bonehookadvt01@gmail.com',
      phone: userInfo?.phone || formData?.phone || formData?.mobile || '9999999999',
      surl: `${process.env.FRONTEND_HOST || 'http://localhost:3000'}/payment/success`,
      furl: `${process.env.FRONTEND_HOST || 'http://localhost:3000'}/payment/failure`
    };

    // Generate hash
    const hash = generatePayUHash(payuData);

    // Return payment data with hash
    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        ...payuData,
        hash: hash,
        paymentUrl: payuConfig.testUrl, // Use test URL for development
        formData: formData,
        formType: formType
      }
    });

    logger.info('Payment initialized successfully', { 
      txnid, 
      amount, 
      formType,
      userId: req.user?.id 
    });

  } catch (error) {
    logger.error('Error initializing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize payment',
      error: error.message
    });
  }
});

// Handle payment success callback
router.post('/success', (req, res) => {
  try {
    const {
      txnid,
      amount,
      status,
      productinfo,
      firstname,
      email,
      phone,
      hash,
      key
    } = req.body;

    logger.info('Payment success callback received', { 
      txnid, 
      amount, 
      status,
      userId: req.user?.id 
    });

    res.status(200).json({
      success: true,
      message: 'Payment success processed',
      data: {
        txnid,
        amount,
        status,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error handling payment success:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment success',
      error: error.message
    });
  }
});

// Handle payment failure callback
router.post('/failure', (req, res) => {
  try {
    const {
      txnid,
      amount,
      status,
      error
    } = req.body;

    logger.error('Payment failed', { 
      txnid, 
      amount, 
      status, 
      error,
      userId: req.user?.id 
    });

    res.status(200).json({
      success: false,
      message: 'Payment failed',
      data: {
        txnid,
        amount,
        status,
        error,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error handling payment failure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment failure',
      error: error.message
    });
  }
});

// Get payment status
router.get('/status/:txnid', (req, res) => {
  try {
    const { txnid } = req.params;

    if (!txnid) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    // In a real implementation, you would query the database
    // For now, return a mock response
    res.status(200).json({
      success: true,
      data: {
        txnid,
        status: 'completed',
        amount: 1000,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status',
      error: error.message
    });
  }
});

export default router;