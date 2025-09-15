import express from "express";
import passport from "passport";

const router = express.Router();

import UserController from "../controllers/userController.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import ContactController from "../controllers/contactUsController.js";
import optionalAuthMiddleware from "../middlewares/contactUs.js";
import AgentController from "../controllers/agentController.js";
import setAuthHeader from "../middlewares/setAuthHeader.js";

// Public Routes
router.post("/agent-register", AgentController.agentRegistration);
router.post("/agent-verify-email", UserController.verifyEmail);
router.post("/agent-login", AgentController.agentLogin);
router.post("/refresh-token", UserController.getNewAccessToken);
router.post("/reset-password-link", AgentController.sendAgentPasswordResetEmail);
router.post("/reset-password/:id/:token", AgentController.agentPasswordReset);


// Procted Routes
router.get("/agent-profile",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),AgentController.agentProfile);
router.post("/agent-change-password",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),AgentController.changeAgentPassword);
router.post("/agent-logout",setAuthHeader, accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}),AgentController.agentLogout);

router.post("/contact",setAuthHeader,accessTokenAutoRefresh,passport.authenticate('userOrAgent', {session: false}), ContactController.submitContactForm);

export default router;