import express from "express";
import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";
import WillDeedController from "../controllers/willDeedController.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(passport.authenticate('jwt', { session: false }));
router.use(accessTokenAutoRefresh);
router.use(setAuthHeader);

// Routes
router.post("/", WillDeedController.create);
router.get("/", WillDeedController.getAll);
router.get("/stats", WillDeedController.getStats);
router.get("/:id", WillDeedController.getById);
router.put("/:id/status", WillDeedController.updateStatus);
router.delete("/:id", WillDeedController.delete);

export default router;
