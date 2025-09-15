import mongoose from "mongoose";

// Defining Schema
const emailVerificationSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
  otp: {type: String, require: true},
  // TTL index to expire documents after 15 minutes
  // Mongo expects seconds for TTL values
  createdAt: {type: Date, default: Date.now, expires: 60 * 15},
});

// Model
const EmailVerificationModel = mongoose.model("EmailVerification", emailVerificationSchema);

export default EmailVerificationModel;

