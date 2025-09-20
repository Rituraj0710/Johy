import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import generateTokens from "../utils/generateTokens.js";
import setTokenCookies from "../utils/setTokenCookies.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import userRefreshTokenModel from "../models/UserRefreshToken.js";
import jwt from "jsonwebtoken"
import transporter from "../config/emailConfig.js";
import logger from "../config/logger.js"; 
class UserController {
  // User Registration
  static userRegistration = async (req,res) =>{
    try {
      // Extract request body parameters
      const {name,phone, email, password, password_confirmation} = req.body;

      // Check if all fields are provided
      if(!name || !phone || !email || !password || !password_confirmation) {
        return res.status(400).json({status: "failed", message: "All fields are required"});
      }

      // Check if password & password_confirmation is matched or not
      if(password !== password_confirmation){
        return res.status(400).json({status: "failed", message: "Password and confirm Password don't match"});
      }


      // Check if phone already exists
      const existingPhone = await UserModel.findOne({phone});
      if(existingPhone){
        return res.status(409).json({status: "failed", message: "Phone Number already exists"});
      }

      // Check if email already exists
      const existingUser = await UserModel.findOne({email});
      if(existingUser){
        logger.warn(`Registration attempt with existing email: ${email}`, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          email: email
        });
        return res.status(409).json({status: "failed", message: "Email already exists"});
      }

      // Generate salt and hash password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashedPassword = await bcrypt.hash(password, salt);

      // create new user or save data of new user
      const newUser = await UserModel.create({name, phone, email, password:hashedPassword});
      await newUser.save();

      await sendEmailVerificationOTP(req, newUser);

      // Log successful registration
      logger.info(`User registration successful: ${email}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: newUser._id,
        email: email
      });

      // send success response
      res.status(201).json({
        status: "success", 
        message: "Registration Success",
        user: {id: newUser._id, email: newUser.email}
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({status: "failed", message: "Unable to register, Please try again later"});
    }
  }

  // Resend Email Verification OTP
  static resendVerificationOTP = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ status: "failed", message: "Email is required" });
      }
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ status: "failed", message: "User not found" });
      }
      if (existingUser.is_verified) {
        return res.status(400).json({ status: "failed", message: "Email is already verified." });
      }

      await sendEmailVerificationOTP(req, existingUser);
      return res.status(200).json({ status: "success", message: "A new OTP has been sent to your email." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: "failed", message: "Unable to resend OTP. Please try again later." });
    }
  }

  // User Email Verification
  static verifyEmail = async (req, res) => {
    try {
      // Extract request body parameters
      const {email, otp} = req.body;

      // Check if all required fields are provided
      if(!email || !otp) {
        return res.status(400).json({status: "failed", message: "All fields are required"});
      }

      const existingUser = await UserModel.findOne({email});
      // Check if email doesn't exists
      if(!existingUser) {
        return  res.status(400).json({status: "failed", message: "Email doesn't exists"});
      }

      // Check if email is already verified
      if(existingUser.is_verified){
        return res.status(400).json({status: "failed", message: "Email is already verified."});  
      }

      // Always compare against the most recent OTP for the user
      const providedOtp = String(otp).trim();
      const emailVerification = await EmailVerificationModel
        .findOne({ userId: existingUser._id })
        .sort({ createdAt: -1 });
      if (!emailVerification) {
        await sendEmailVerificationOTP(req, existingUser);
        return res.status(400).json({ status: "failed", message: "No OTP found. A new OTP has been sent to your email." });
      }
      // Check if OTP matches
      if (String(emailVerification.otp).trim() !== providedOtp) {
        return res.status(400).json({ status: "failed", message: "Invalid OTP. Please try again." });
      }

      // const emailVerification = await EmailVerificationModel.findOne({userId: existingUser._id, otp});
      // if(!emailVerification) {
      //   if(!existingUser.is_verified){
      //     console.log(existingUser);
      //     await sendEmailVerificationOTP(req, existingUser);
      //     return res.status(400).json({status:"failed", message: "Invalid OTP, new OTP sent to your email"});
      //   }
      //   return res.status(400).json({status:"failed", message:"Invalid OTP"});
      // }

      // Check if OTP is expired
      const currentTime = new Date();
      // 15 * 60 * 1000 calculate the expiration period in milliseconds(15 minutes).
      const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
      if(currentTime > expirationTime) {
        // OTP expired, send new OTP
        await EmailVerificationModel.deleteMany({ userId: existingUser._id }); // Clear old OTPs
      await sendEmailVerificationOTP(req, existingUser); // Send new OTP
      return res.status(400).json({ status: "failed", message: "OTP expired. A new OTP has been sent to your email." });
        // await sendEmailVerificationOTP(req, existingUser);
        // return res.status(400).json({status: "failed", message: "OTP expired, new OTP sent to your email"});
      }

      // OTP is valid and not expired, mark email as verified
      existingUser.is_verified = true;
      await existingUser.save();

      // Delete email verification document
      await EmailVerificationModel.deleteMany({userId: existingUser._id,});

      res.status(200).json({ status: "success", message: "Email verified successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({status: "failed", message: "Unable to verify email, please try again later."});
    }
  }

  // User Login
  static userLogin = async (req, res) => {
    try {
      const {email, password} = req.body;
      // Check is email and password are provided
      if(!email || !password) {
        return res.status(400).json({status:"failed", message: "Email and password are required"});
      }
      // Find user by email
      const user = await UserModel.findOne({email});

      // Check if user exists
      if(!user){
        logger.warn(`Login attempt with non-existent email: ${email}`, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          email: email
        });
        return res.status(400).json({status:"failed", message:"Invalid email or password"});
      }

      // Check if user is an agent
      if(!user.roles.includes("user")){
        return res.status(403).json({status: "failed", message: "Access denied. Not an user"})
      }
      // Check if user verified or not
      if(!user.is_verified) {
        return res.status(401).json({status: "failed", message: "Your account is not verified"})
      }

      // Compare password / Check Password
      const isMatch =  await bcrypt.compare(password, user.password);
      if(!isMatch){
        logger.warn(`Failed login attempt - incorrect password: ${email}`, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          email: email,
          userId: user._id
        });
        return res.status(401).json({status:"failed", message:"Invalid email or password"}); 
      }

      // Generate tokens
      const {accessToken, refreshToken, accessTokenExp, refreshTokenExp} = await generateTokens(user);

      // Extract role
      const role = user.roles[0];

      // No cookies – frontend stores tokens in localStorage

      // Log successful login
      logger.info(`User login successful: ${email}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: user._id,
        email: email,
        role: role
      });

      // Send Success Response with Tokens
      res.status(200).json({
        user: {id: user._id, email: user.email, name:user.name, roles: user.roles[0]},
        status: "success",
        message: "Login successful",
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_exp: accessTokenExp,
        is_auth: true,
      })

    } catch (error) {
      console.error(error);
      res.status(500).json({status: "failed", message: "Unable to login, please try again later"});
    }
  }

  // Get New Access Token OR Refresh Token
  static getNewAccessToken = async (req,res) =>{
    try {
      // Get new access token using Refresh Token
      const{newAccessToken, newRefreshToken, newAccessTokenExp,newRefreshTokenExp} = await refreshAccessToken(req,res)
    // Set New Token to Cookie
    setTokenCookies(res, newAccessToken, newRefreshToken, newAccessTokenExp, newRefreshTokenExp)
    res.status(200).send({
      status: "success",
      message: "New tokens generated", 
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      access_token_exp: newAccessTokenExp,
    });
    } catch (error) {
      console.error(error);
      res.status(500).json({status: "failed", message: "Unable to generate new token, please try again later."})
    }
  }

  // Profile OR Logged in User
  static userProfile = async(req,res) => {
    res.send({"user": req.user})
  }

  // Change Password
  static changeUserPassword = async (req,res) =>{
    try {
      const {password, password_confirmation} = req.body;
      // check if both fields are provided 
      if(!password || !password_confirmation) {
        return res.status(400).json({status: "failed", message:"Password and Confirm password are required"})
      }

      // Check if password and password_confirmation match
      if(password !== password_confirmation){
        return res.status(400).json({status: "failed", message:"New Password and confirm password don't match"})
      }

      // Generate salt and hash new password
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);

      // Update user's password
      await UserModel.findByIdAndUpdate(req.user._id, {$set: {password: newHashPassword}});

      // send success response
      res.status(200).json({status: "success", message:"Password changed successfully."});

    } catch (error) {
      console.error(error);
      res.status(500).json({status: "failed", message: "Unable to change password, please try again later."});
    }
  }

  // Send Password Reset link via Email
  static sendUserPasswordResetEmail = async (req, res) =>{
    try {
      const {email} = req.body;
      // check if email is provided
      if(!email){
        return res.status(400).json({status:"failed", message:"Email field is required."})
      }
      // Find user by email
      const user = await UserModel.findOne({email});
      if(!user){
        return res.status(404).json({status:"failed", message:"Email doesn't exist."});
      }

      // Generate token for password reset
      const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRECT_KEY;
      const token = jwt.sign({userId: user._id}, secret, {expiresIn: '15m'});
      // Reset Link
      const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;
      console.log("ResetLink->", resetLink);

      // Send password reset email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Link",
        html: `<p>Hello ${user.name},</p>
        <p>Please <a href='${resetLink}'>click here</a> to reset your password.</p>`,
      });

      // send success response
      res.status(200).json({status:"success", message:"Password reset email sent. Please check your email."})

    } catch (error) {
      console.error(error);
      res.status(500).json({status: "failed", message: "Unable to send password reset email. Please try again later."});
    }
  }

  // Password Reset
  static userPasswordReset = async (req,res) =>{
    try {
      const {password, password_confirmation} = req.body;
      const {id, token} = req.params;
      
      // Find user by ID
      const user = await UserModel.findById(id);
      console.log("user for password reset:", user);
      if(!user){
        return res.status(400).json({status: "failed", message:"User not found."});
      }
      // Validate token 
      const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRECT_KEY;
      jwt.verify(token, new_secret);

      // Check if password and confirm_password is provided
      if(!password || !password_confirmation){
        return res.status(400).json({status: "failed", message:"New password and confirm password are required."});
      }

      // Check if both password is match 
      if(password !== password_confirmation){
        res.status(400).json({status: "failed", message:"New password and confirm password don't match"});
      }

      // Generate salt and hash new password
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(password, salt);

      // Updates user's password
      await UserModel.findByIdAndUpdate(user._id, {$set: {password: newHashPassword}});

      // Send success response
      res.status(200).json({status: "success", message:"Password reset successfully."});
    } catch (error) {
      if(error.name === "TokenExpiredError"){
        return res.status(400).json({status:"failed", message:"Token expired. Please request new password link."});
      }
      return res.status(500).json({status: "failed", message:"Unable to reset password. Please try again later."});
    }
  }

  // Logout
  static userLogout = async (req,res) =>{
    try {
      // optionally, blacklist the refresh token in the database
      const refreshToken = req.cookies.refreshToken;
      await userRefreshTokenModel.findOneAndUpdate(
        {token: refreshToken},
        {$set: {blacklisted: true}}
      );

      // cleare access & refresh token cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('is_auth');
      res.clearCookie('role');

      res.status(200).json({status: "success", message: "Logout successful"});
    } catch (error) {
      console.error(error);
      res.status(500).json({status:"failed", message:"Unable to logout, please try again later"});
    }
  }
}

export default UserController;