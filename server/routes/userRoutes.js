import express from "express";
import passport from "passport";

const router = express.Router();

import UserController from "../controllers/userController.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import ContactController from "../controllers/contactUsController.js";
import optionalAuthMiddleware from "../middlewares/contactUs.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";
import { authLimiter, passwordResetLimiter, emailVerificationLimiter } from "../config/rateLimits.js";

// Public Routes with rate limiting
router.post("/register", authLimiter, UserController.userRegistration);
router.post("/verify-email", emailVerificationLimiter, UserController.verifyEmail);
router.post("/login", authLimiter, UserController.userLogin);
router.post("/refresh-token", UserController.getNewAccessToken);
router.post("/reset-password-link", passwordResetLimiter, UserController.sendUserPasswordResetEmail);
router.post("/reset-password/:id/:token", passwordResetLimiter, UserController.userPasswordReset);


// Procted Routes
router.get("/profile",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),UserController.userProfile);
router.post("/change-password",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),UserController.changeUserPassword);
router.post("/logout",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),UserController.userLogout);

router.post("/contact",setAuthHeader,accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}), ContactController.submitContactForm);

export default router;