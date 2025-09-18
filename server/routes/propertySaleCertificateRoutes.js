// import express from "express";
// import passport from "passport";
// import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
// import setAuthHeader from "../middlewares/setAuthHeader.js";
// import PropertySaleCertificateController from "../controllers/propertySaleCertificateController.js";
// import { body } from 'express-validator';
// import multer from 'multer';
// import path from 'path';

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), 'uploads', 'property-sale-certificates');
//     // Create directory if it doesn't exist
//     const fs = require('fs');
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Generate unique filename
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // File filter for allowed file types
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     'application/pdf',
//     'image/jpeg',
//     'image/jpg', 
//     'image/png',
//     'application/msword',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//   ];

//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only PDF, JPG, JPEG, PNG, DOC, and DOCX files are allowed.'), false);
//   }
// };

// const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
//     files: 20 // Allow multiple files
//   }
// });

// // Validation middleware for Property Sale Certificate
// const validatePropertySaleCertificate = [
//   // Bank Information
//   body('bank_select').notEmpty().withMessage('बैंक का नाम आवश्यक है।').isString().trim(),
//   body('bank_reg_off').notEmpty().withMessage('पंजीकृत कार्यालय का पता आवश्यक है।').isString().trim(),
//   body('bank_head_off').notEmpty().withMessage('प्रधान कार्यालय आवश्यक है।').isString().trim(),

//   // Bank Representative
//   body('bank_rep_name').notEmpty().withMessage('बैंक प्रतिनिधि का नाम आवश्यक है।').isString().trim(),
//   body('bank_rep_father_name').notEmpty().withMessage('पिता/पति का नाम आवश्यक है।').isString().trim(),
//   body('bank_rep_addr').notEmpty().withMessage('पता आवश्यक है।').isString().trim(),
//   body('bank_rep_mobile').notEmpty().withMessage('मोबाइल नंबर आवश्यक है।').matches(/^[0-9]{10}$/).withMessage('मोबाइल नंबर 10 अंकों का होना चाहिए।'),
//   body('bank_rep_email').optional().isEmail().withMessage('वैध ईमेल आवश्यक है।'),

//   // Acknowledgement Receipt
//   body('ack_amount').notEmpty().withMessage('रसीद की राशि आवश्यक है।').isNumeric().withMessage('राशि संख्या में होनी चाहिए।').toFloat().isFloat({ min: 0 }).withMessage('राशि धनात्मक होनी चाहिए।'),

//   // Previous Owner Information
//   body('previous_owner').notEmpty().withMessage('पूर्व-स्वामी का नाम आवश्यक है।').isString().trim(),
//   body('acquisition_mode').notEmpty().withMessage('मोड ऑफ एक्विजिशन आवश्यक है।').isString().trim(),
//   body('bank_power').notEmpty().withMessage('बैंक को संपत्ति पर अधिकार कैसे मिला, यह आवश्यक है।').isString().trim(),

//   // Property Information
//   body('prop_category').notEmpty().withMessage('संपत्ति श्रेणी आवश्यक है।').isIn(['Residential', 'Commercial', 'Industrial', 'Agriculture']).withMessage('अमान्य संपत्ति श्रेणी।'),
//   body('prop_subtype').notEmpty().withMessage('उपयोग आवश्यक है।').isString().trim(),
//   body('prop_address').notEmpty().withMessage('संपत्ति का पूरा पता आवश्यक है।').isString().trim(),
//   body('prop_state').notEmpty().withMessage('राज्य आवश्यक है।').isString().trim(),
//   body('prop_tehsil').notEmpty().withMessage('तहसील आवश्यक है।').isString().trim(),
//   body('prop_ward').notEmpty().withMessage('वार्ड/गांव/कॉलोनी आवश्यक है।').isString().trim(),

//   // Boundary Details
//   body('bd_north').notEmpty().withMessage('उत्तर दिशा की सीमा आवश्यक है।').isString().trim(),
//   body('bd_south').notEmpty().withMessage('दक्षिण दिशा की सीमा आवश्यक है।').isString().trim(),
//   body('bd_east').notEmpty().withMessage('पूर्व दिशा की सीमा आवश्यक है।').isString().trim(),
//   body('bd_west').notEmpty().withMessage('पश्चिम दिशा की सीमा आवश्यक है।').isString().trim(),

//   // Circle Rate and Stamp Duty
//   body('circle_rate').notEmpty().withMessage('सर्किल रेट आवश्यक है।').isNumeric().withMessage('सर्किल रेट संख्या में होना चाहिए।').toFloat().isFloat({ min: 0 }).withMessage('सर्किल रेट धनात्मक होना चाहिए।'),
//   body('stamp_duty').notEmpty().withMessage('स्टाम्प ड्यूटी आवश्यक है।').isNumeric().withMessage('स्टाम्प ड्यूटी संख्या में होनी चाहिए।').toFloat().isFloat({ min: 0 }).withMessage('स्टाम्प ड्यूटी धनात्मक होनी चाहिए।'),
//   body('stamp_no').notEmpty().withMessage('ई-स्टाम्प नं. आवश्यक है।').isString().trim(),
//   body('stamp_amount_manual').notEmpty().withMessage('स्टाम्प राशि आवश्यक है।').isNumeric().withMessage('स्टाम्प राशि संख्या में होनी चाहिए।').toFloat().isFloat({ min: 0 }).withMessage('स्टाम्प राशि धनात्मक होनी चाहिए।'),
//   body('stamp_date').notEmpty().withMessage('स्टाम्प की तारीख आवश्यक है।').isISO8601().toDate().withMessage('अमान्य तिथि प्रारूप।'),

//   // Legal Details
//   body('legal_rule_select').notEmpty().withMessage('लागू नियम और विनियम चुनें।').isString().trim(),
//   body('legal_clauses').notEmpty().withMessage('कानूनी क्लॉज आवश्यक है।').isString().trim(),
//   body('power_authority').isArray({ min: 1 }).withMessage('कम से कम एक अधिकार और शक्ति चुनें।'),

//   // Agreement Details
//   body('agreement_no').notEmpty().withMessage('एग्रीमेंट संख्या आवश्यक है।').isString().trim(),
//   body('agreement_date').notEmpty().withMessage('एग्रीमेंट की तारीख आवश्यक है।').isISO8601().toDate().withMessage('अमान्य तिथि प्रारूप।'),
//   body('payment_terms').notEmpty().withMessage('भुगतान योजना/शर्तें आवश्यक हैं।').isString().trim(),

//   // Other Details
//   body('advocate_name').notEmpty().withMessage('एडवोकेट का नाम आवश्यक है।').isString().trim(),
//   body('draft_date').notEmpty().withMessage('ड्राफ्ट प्रिंट होने की तिथि आवश्यक है।').isISO8601().toDate().withMessage('अमान्य तिथि प्रारूप।'),
// ];

// // POST /api/property-sale-certificate - Create a new property sale certificate
// router.post(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   upload.fields([
//     { name: 'bank_rep_photo', maxCount: 1 },
//     { name: 'prop_photo', maxCount: 1 },
//     { name: /^purchaser_photo_\d+$/, maxCount: 1 },
//     { name: /^witness_photo_\d+$/, maxCount: 1 }
//   ]), // Handle multiple file uploads
//   validatePropertySaleCertificate, // Apply validation rules
//   PropertySaleCertificateController.create
// );

// // GET /api/property-sale-certificate - Get all property sale certificates with pagination and filtering
// router.get(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertySaleCertificateController.getAll
// );

// // GET /api/property-sale-certificate/stats - Get statistics for dashboard
// router.get(
//   "/stats",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertySaleCertificateController.getStats
// );

// // GET /api/property-sale-certificate/:id - Get a specific property sale certificate by ID
// router.get(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertySaleCertificateController.getById
// );

// // GET /api/property-sale-certificate/:id/download - Download a specific file
// router.get(
//   "/:id/download",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertySaleCertificateController.downloadFile
// );

// // PUT /api/property-sale-certificate/:id - Update a property sale certificate
// router.put(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   upload.fields([
//     { name: 'bank_rep_photo', maxCount: 1 },
//     { name: 'prop_photo', maxCount: 1 },
//     { name: /^purchaser_photo_\d+$/, maxCount: 1 },
//     { name: /^witness_photo_\d+$/, maxCount: 1 }
//   ]), // Handle multiple file uploads
//   validatePropertySaleCertificate, // Apply validation rules for update as well
//   PropertySaleCertificateController.update
// );

// // DELETE /api/property-sale-certificate/:id - Delete a property sale certificate
// router.delete(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertySaleCertificateController.delete
// );

// export default router;
import express from 'express';
import multer from 'multer';
import path from 'path';
import { createPropertySaleCertificate, getPropertySaleCertificate, getAllPropertySaleCertificates } from '../controllers/propertySaleCertificateController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', upload.any(), createPropertySaleCertificate);
router.get('/:id', getPropertySaleCertificate);
router.get('/', getAllPropertySaleCertificates);

export default router;