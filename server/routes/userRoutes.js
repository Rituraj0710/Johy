import express from "express";
import passport from "passport";

const router = express.Router();

import UserController from "../controllers/userController.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import ContactController from "../controllers/contactUsController.js";
import optionalAuthMiddleware from "../middlewares/contactUs.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";

// Public Routes
router.post("/register", UserController.userRegistration);
router.post("/verify-email", UserController.verifyEmail);
router.post("/login", UserController.userLogin);
router.post("/refresh-token", UserController.getNewAccessToken);
router.post("/reset-password-link", UserController.sendUserPasswordResetEmail);
router.post("/reset-password/:id/:token", UserController.userPasswordReset);


// Procted Routes
router.get("/profile",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),UserController.userProfile);
router.post("/change-password",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),UserController.changeUserPassword);
router.post("/logout",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),UserController.userLogout);

router.post("/contact",setAuthHeader,accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}), ContactController.submitContactForm);

export default router;