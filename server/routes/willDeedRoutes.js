import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";
import WillDeedController from "../controllers/willDeedController.js";

const router = express.Router();

const uploadRoot = path.join(process.cwd(), "uploads", "willdeed");
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: function(req, file, cb){ cb(null, uploadRoot); },
  filename: function(req, file, cb){
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${ts}_${safe}`);
  }
});

const upload = multer({ storage });

router.post(
  "/",
  setAuthHeader,
  accessTokenAutoRefresh,
  // optional: allow guest by removing authenticate, or keep it to require login
  // passport.authenticate('userOrAgent', { session: false }),
  upload.any(),
  WillDeedController.create
);

export default router;


