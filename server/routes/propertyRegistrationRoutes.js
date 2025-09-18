// import express from "express";
// import passport from "passport";
// import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
// import setAuthHeader from "../middlewares/setAuthHeader.js";
// import PropertyRegistrationController from "../controllers/propertyRegistrationController.js";
// import { body } from 'express-validator';

// const router = express.Router();

// // Validation middleware for Property Registration creation and update
// const validatePropertyRegistration = [
//   // Seller validation
//   body('seller_name')
//     .notEmpty()
//     .withMessage('विक्रेता का नाम आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage('विक्रेता का नाम 100 अक्षरों से अधिक नहीं हो सकता।'),

//   body('seller_father_name')
//     .notEmpty()
//     .withMessage('विक्रेता के पिता/पति का नाम आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage('पिता/पति का नाम 100 अक्षरों से अधिक नहीं हो सकता।'),

//   body('seller_address')
//     .notEmpty()
//     .withMessage('विक्रेता का पता आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 500 })
//     .withMessage('पता 500 अक्षरों से अधिक नहीं हो सकता।'),

//   body('seller_aadhaar')
//     .notEmpty()
//     .withMessage('विक्रेता का आधार नंबर आवश्यक है।')
//     .matches(/^[0-9]{12}$/)
//     .withMessage('आधार नंबर 12 अंकों का होना चाहिए।'),

//   body('seller_mobile')
//     .notEmpty()
//     .withMessage('विक्रेता का मोबाइल नंबर आवश्यक है।')
//     .matches(/^[0-9]{10}$/)
//     .withMessage('मोबाइल नंबर 10 अंकों का होना चाहिए।'),

//   // Buyer validation
//   body('buyer_name')
//     .notEmpty()
//     .withMessage('खरीदार का नाम आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage('खरीदार का नाम 100 अक्षरों से अधिक नहीं हो सकता।'),

//   body('buyer_father_name')
//     .notEmpty()
//     .withMessage('खरीदार के पिता/पति का नाम आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 100 })
//     .withMessage('पिता/पति का नाम 100 अक्षरों से अधिक नहीं हो सकता।'),

//   body('buyer_address')
//     .notEmpty()
//     .withMessage('खरीदार का पता आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 500 })
//     .withMessage('पता 500 अक्षरों से अधिक नहीं हो सकता।'),

//   body('buyer_aadhaar')
//     .notEmpty()
//     .withMessage('खरीदार का आधार नंबर आवश्यक है।')
//     .matches(/^[0-9]{12}$/)
//     .withMessage('आधार नंबर 12 अंकों का होना चाहिए।'),

//   body('buyer_mobile')
//     .notEmpty()
//     .withMessage('खरीदार का मोबाइल नंबर आवश्यक है।')
//     .matches(/^[0-9]{10}$/)
//     .withMessage('मोबाइल नंबर 10 अंकों का होना चाहिए।'),

//   // Property validation
//   body('property_address')
//     .notEmpty()
//     .withMessage('संपत्ति का पता आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 500 })
//     .withMessage('संपत्ति का पता 500 अक्षरों से अधिक नहीं हो सकता।'),

//   body('property_type')
//     .notEmpty()
//     .withMessage('संपत्ति का प्रकार आवश्यक है।')
//     .isIn(['आवासीय', 'व्यावसायिक', 'कृषि'])
//     .withMessage('संपत्ति का प्रकार आवासीय, व्यावसायिक, या कृषि होना चाहिए।'),

//   body('area_sqm')
//     .notEmpty()
//     .withMessage('क्षेत्रफल आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 50 })
//     .withMessage('क्षेत्रफल 50 अक्षरों से अधिक नहीं हो सकता।'),

//   body('sale_price')
//     .notEmpty()
//     .withMessage('बिक्री मूल्य आवश्यक है।')
//     .isString()
//     .trim()
//     .isLength({ max: 50 })
//     .withMessage('बिक्री मूल्य 50 अक्षरों से अधिक नहीं हो सकता।'),

//   body('registration_date')
//     .notEmpty()
//     .withMessage('पंजीकरण की तिथि आवश्यक है।')
//     .isISO8601()
//     .withMessage('पंजीकरण की तिथि वैध ISO 8601 प्रारूप में होनी चाहिए।')
// ];

// // POST /api/property-registration - Create a new property registration
// router.post(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   validatePropertyRegistration,
//   PropertyRegistrationController.create
// );

// // GET /api/property-registration - Get all property registrations with pagination and filtering
// router.get(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertyRegistrationController.getAll
// );

// // GET /api/property-registration/stats - Get statistics for dashboard
// router.get(
//   "/stats",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertyRegistrationController.getStats
// );

// // GET /api/property-registration/:id - Get a specific property registration by ID
// router.get(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertyRegistrationController.getById
// );

// // PUT /api/property-registration/:id - Update a property registration
// router.put(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   validatePropertyRegistration,
//   PropertyRegistrationController.update
// );

// // DELETE /api/property-registration/:id - Delete a property registration
// router.delete(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // passport.authenticate('userOrAgent', { session: false }), // Uncomment to require authentication
//   PropertyRegistrationController.delete
// );

// export default router;

import express from 'express';
import passport from 'passport';
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";
import PropertyRegistrationController from "../controllers/propertyRegistrationController.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(passport.authenticate('jwt', { session: false }));
router.use(accessTokenAutoRefresh);
router.use(setAuthHeader);

// Routes
router.post("/", PropertyRegistrationController.create);
router.get("/", PropertyRegistrationController.getAll);
router.get("/stats", PropertyRegistrationController.getStats);
router.get("/:id", PropertyRegistrationController.getById);
router.put("/:id/status", PropertyRegistrationController.updateStatus);
router.delete("/:id", PropertyRegistrationController.delete);

export default router;