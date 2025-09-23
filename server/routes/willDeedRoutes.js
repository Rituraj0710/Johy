import express from "express";
import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";
import WillDeedController from "../controllers/willDeedController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Apply optional authentication middleware to all routes
router.use((req, res, next) => {
  passport.authenticate('userOrAgent', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
});
router.use(accessTokenAutoRefresh);
router.use(setAuthHeader);

// Multer setup for will deed uploads
const uploadsDir = path.join(process.cwd(), 'uploads', 'will-deeds');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '') || '';
    cb(null, `${unique}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Routes
router.post("/submit", upload.any(), WillDeedController.submit);
router.post("/", WillDeedController.create);
router.get("/", WillDeedController.getAll);
router.get("/stats", WillDeedController.getStats);
router.get("/:id", WillDeedController.getById);
router.put("/:id/status", WillDeedController.updateStatus);
router.delete("/:id", WillDeedController.delete);

export default router;
