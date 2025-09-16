// import express from "express";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import passport from "passport";
// import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
// import setAuthHeader from "../middlewares/setAuthHeader.js";
// import WillDeedController from "../controllers/willDeedController.js";

// const router = express.Router();

// const uploadRoot = path.join(process.cwd(), "uploads", "willdeed");
// fs.mkdirSync(uploadRoot, { recursive: true });

// const storage = multer.diskStorage({
//   destination: function(req, file, cb){ cb(null, uploadRoot); },
//   filename: function(req, file, cb){
//     const ts = Date.now();
//     const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
//     cb(null, `${ts}_${safe}`);
//   }
// });

// const upload = multer({ storage });

// router.post(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // optional: allow guest by removing authenticate, or keep it to require login
//   // passport.authenticate('userOrAgent', { session: false }),
//   upload.any(),
//   WillDeedController.create
// );

// export default router;



// routes/willDeedRoutes.js

import express from "express";
import {
  submitWillDeed,
  getAllWillDeeds,
  getWillDeedById,
  updateWillDeedStatus,
  deleteWillDeed,
  getWillDeedStats,
  upload
} from "../controllers/willDeedController.js";

const router = express.Router();

// Multer fields configuration for file uploads
const uploadFields = upload.fields([
  { name: 'testator_id', maxCount: 1 },
  { name: 'testator_photo', maxCount: 1 },
  // Dynamic fields for person uploads (beneficiaries, executors, witnesses)
  { name: 'person_id_0', maxCount: 1 },
  { name: 'person_id_1', maxCount: 1 },
  { name: 'person_id_2', maxCount: 1 },
  { name: 'person_id_3', maxCount: 1 },
  { name: 'person_id_4', maxCount: 1 },
  { name: 'person_id_5', maxCount: 1 },
  { name: 'person_id_6', maxCount: 1 },
  { name: 'person_id_7', maxCount: 1 },
  { name: 'person_id_8', maxCount: 1 },
  { name: 'person_id_9', maxCount: 1 },
  { name: 'person_photo_0', maxCount: 1 },
  { name: 'person_photo_1', maxCount: 1 },
  { name: 'person_photo_2', maxCount: 1 },
  { name: 'person_photo_3', maxCount: 1 },
  { name: 'person_photo_4', maxCount: 1 },
  { name: 'person_photo_5', maxCount: 1 },
  { name: 'person_photo_6', maxCount: 1 },
  { name: 'person_photo_7', maxCount: 1 },
  { name: 'person_photo_8', maxCount: 1 },
  { name: 'person_photo_9', maxCount: 1 }
]);

// Public Routes

/**
 * @route   POST /api/will-deed/submit
 * @desc    Submit a new Will Deed
 * @access  Public (can be protected with auth middleware later)
 */
router.post('/submit', uploadFields, submitWillDeed);

/**
 * @route   GET /api/will-deed
 * @desc    Get all Will Deeds with pagination
 * @access  Public (can be protected with auth middleware later)
 * @query   page, limit, status
 */
router.get('/', getAllWillDeeds);

/**
 * @route   GET /api/will-deed/stats
 * @desc    Get Will Deed statistics
 * @access  Public (can be protected with auth middleware later)
 */
router.get('/stats', getWillDeedStats);

/**
 * @route   GET /api/will-deed/:id
 * @desc    Get Will Deed by ID
 * @access  Public (can be protected with auth middleware later)
 */
router.get('/:id', getWillDeedById);

/**
 * @route   PUT /api/will-deed/:id/status
 * @desc    Update Will Deed status (for admin/agent use)
 * @access  Public (should be protected with admin/agent auth middleware)
 */
router.put('/:id/status', updateWillDeedStatus);

/**
 * @route   DELETE /api/will-deed/:id
 * @desc    Delete Will Deed
 * @access  Public (can be protected with auth middleware later)
 */
router.delete('/:id', deleteWillDeed);

export default router;