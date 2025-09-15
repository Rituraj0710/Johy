import mongoose from "mongoose";

const userSchema = new  mongoose.Schema({
  name: {type: String, required: true, trim: true},
  phone: {type: Number, required: true,},
  email: {type: String, required: true, trim: true, unique: true, lowercase:true},
  password: {type: String, required:true, trim: true,},
  is_verified: {type: Boolean, default: false},
  roles: {type: [String],enum: ["user", "agent", "admin"], default: ["user"]},
  createdAt: { type: Date, default: Date.now },
});


// Model 
const UserModel = mongoose.model("user", userSchema)

export default  UserModel;