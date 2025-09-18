// ...existing code...
import multer from "multer";
import path from "path";
import fs from "fs";
// import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";
// ...existing code...

// ...existing code...

// Create upload directory for trust deeds
const uploadRoot = path.join(process.cwd(), "uploads", "trustdeed");
fs.mkdirSync(uploadRoot, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadRoot);
  },
  filename: function(req, file, cb) {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${ts}_${safe}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 20 // Maximum 20 files
  },
  fileFilter: (req, file, cb) => {
    // Allow common document and image types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, images, and documents are allowed.'), false);
    }
  }
});

// // POST /api/trust-deed - Create a new trust deed
// router.post(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   upload.any(),
//   TrustDeedController.create
// );

// // GET /api/trust-deed - Get all trust deeds with pagination and filtering
// router.get(
//   "/",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   TrustDeedController.getAll
// );

// // GET /api/trust-deed/stats - Get statistics for dashboard
// router.get(
//   "/stats",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   TrustDeedController.getStats
// );

// // GET /api/trust-deed/:id - Get a specific trust deed by ID
// router.get(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   TrustDeedController.getById
// );

// // PUT /api/trust-deed/:id - Update a trust deed
// router.put(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   upload.any(),
//   TrustDeedController.update
// );

// // DELETE /api/trust-deed/:id - Delete a trust deed
// router.delete(
//   "/:id",
//   setAuthHeader,
//   accessTokenAutoRefresh,
//   // Optional: require authentication by uncommenting the line below
//   // passport.authenticate('userOrAgent', { session: false }),
//   TrustDeedController.delete
// );

// export default router;


import express from "express";
import passport from "passport";
import TrustDeedController from "../controllers/trustDeedController.js";

const router = express.Router();

// Define upload fields for Multer
const uploadFields = [
  { name: "trusteeIdCard_1", maxCount: 1 },
  { name: "trusteePhoto_1", maxCount: 1 },
  { name: "trusteeIdCard_2", maxCount: 1 },
  { name: "trusteePhoto_2", maxCount: 1 },
  { name: "trusteeIdCard_3", maxCount: 1 },
  { name: "trusteePhoto_3", maxCount: 1 },
  { name: "trusteeIdCard_4", maxCount: 1 },
  { name: "trusteePhoto_4", maxCount: 1 },
  { name: "trusteeIdCard_5", maxCount: 1 },
  { name: "trusteePhoto_5", maxCount: 1 },
  { name: "witnessIdCard_1", maxCount: 1 },
  { name: "witnessPhoto_1", maxCount: 1 },
  { name: "witnessIdCard_2", maxCount: 1 },
  { name: "witnessPhoto_2", maxCount: 1 },
];

// Apply authentication middleware to all routes
router.use(passport.authenticate('jwt', { session: false }));
router.use(accessTokenAutoRefresh);
router.use(setAuthHeader);

router.post("/", upload.fields(uploadFields), TrustDeedController.create);
router.get("/", TrustDeedController.getAll);
router.get("/stats", TrustDeedController.getStats);
router.get("/:id", TrustDeedController.getById);
router.put("/:id/status", TrustDeedController.updateStatus);
router.delete("/:id", TrustDeedController.delete);

export default router;