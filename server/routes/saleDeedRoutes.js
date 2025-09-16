// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import passport from "passport";
// import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
// import setAuthHeader from "../middlewares/setAuthHeader.js";
// import SaleDeedController from "../controllers/saleDeedController.js";

// const router = express.Router();

// // Create upload directory for sale deeds
// const uploadRoot = path.join(process.cwd(), "uploads", "saledeed");
// fs.mkdirSync(uploadRoot, { recursive: true });

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, uploadRoot);
//   },
//   filename: function(req, file, cb) {
//     const ts = Date.now();
//     const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
//     cb(null, `${ts}_${safe}`);
//   }
// });

// const upload = multer({ 
//   storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//     files: 10 // Maximum 10 files
//   },
//   fileFilter: (req, file, cb) => {
//     // Allow common document and image types
//     const allowedTypes = [
//       'application/pdf',
//       'image/jpeg',
//       'image/jpg',
//       'image/png',
//       'image/gif',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//       'text/plain'
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only PDF, images, and documents are allowed.'), false);
//     }
//   }
// });

// // POST /api/sale-deed - Create a new sale deed
// router.post(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   upload.any(),
//   SaleDeedController.create
// );

// // GET /api/sale-deed - Get all sale deeds with pagination and filtering
// router.get(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   SaleDeedController.getAll
// );

// // GET /api/sale-deed/stats - Get statistics for dashboard
// router.get(
//   "/stats",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   SaleDeedController.getStats
// );

// // GET /api/sale-deed/:id - Get a specific sale deed by ID
// router.get(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   SaleDeedController.getById
// );

// // PUT /api/sale-deed/:id - Update a sale deed
// router.put(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   upload.any(),
//   SaleDeedController.update
// );

// // DELETE /api/sale-deed/:id - Delete a sale deed
// router.delete(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   SaleDeedController.delete
// );

// export default router;


// const express = require('express');
// const router = express.Router();
// const saleDeedController = require('../controllers/saleDeedController');
// // const authMiddleware = require('../middleware/auth'); // Assuming you have authentication middleware

// router.post('/', saleDeedController.createSaleDeed);
// router.get('/', saleDeedController.getAllSaleDeeds);
// router.get('/:id', saleDeedController.getSaleDeed);
// router.put('/:id', saleDeedController.updateSaleDeed);
// router.delete('/:id', saleDeedController.deleteSaleDeed);

// module.exports = router;


import express from 'express';
import {
  createSaleDeed,
  getAllSaleDeeds,
  getSaleDeed,
  updateSaleDeed,
  deleteSaleDeed
} from '../controllers/saleDeedController.js';

const router = express.Router();

router.post('/', createSaleDeed);
router.get('/', getAllSaleDeeds);
router.get('/:id', getSaleDeed);
router.put('/:id', updateSaleDeed);
router.delete('/:id', deleteSaleDeed);

export default router;
