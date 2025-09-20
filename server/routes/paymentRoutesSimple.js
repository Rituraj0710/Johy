import express from 'express';

const router = express.Router();

// Simple test route
router.get('/test', (req, res) => {
  res.json({ status: 'success', message: 'Simple payment routes working' });
});

// Simple initialize route
router.post('/initialize', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Payment initialized',
    data: {
      key: 'gtKFFx',
      txnid: `TXN${Date.now()}`,
      amount: 1000,
      productinfo: 'Test Form Submission',
      firstname: 'Test User',
      email: 'bonehookadvt01@gmail.com',
      phone: '9999999999',
      surl: 'http://localhost:3000/payment/success',
      furl: 'http://localhost:3000/payment/failure',
      hash: 'test_hash'
    }
  });
});

export default router;
