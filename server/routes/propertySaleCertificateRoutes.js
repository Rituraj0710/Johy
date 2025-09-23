import express from "express";
import passport from "passport";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";
import PropertySaleCertificateController from "../controllers/propertySaleCertificateController.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(passport.authenticate('userOrAgent', { session: false }));
router.use(accessTokenAutoRefresh);
router.use(setAuthHeader);

// Routes
router.post("/", PropertySaleCertificateController.create);
router.get("/", PropertySaleCertificateController.getAll);
router.get("/stats", PropertySaleCertificateController.getStats);
router.get("/:id", PropertySaleCertificateController.getById);
router.put("/:id/status", PropertySaleCertificateController.updateStatus);
router.delete("/:id", PropertySaleCertificateController.delete);

export default router;
