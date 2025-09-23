import mongoose from "mongoose";

const userSchema = new  mongoose.Schema({
  name: {type: String, required: true, trim: true},
  phone: {type: Number, required: true,},
  email: {type: String, required: true, trim: true, unique: true, lowercase:true},
  password: {type: String, required:true, trim: true,},
  is_verified: {type: Boolean, default: false},
  roles: {type: [String],enum: ["user", "admin", "staff_1", "staff_2", "staff_3", "staff_4", "staff_5", "staff_6", "staff_7"], default: ["user"]},
  createdAt: { type: Date, default: Date.now },
});


// Model 
const UserModel = mongoose.model("User", userSchema)

export default  UserModel;