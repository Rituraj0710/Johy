import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  field: {type: String, required: true},
  path: {type: String, required: true},
  originalName: {type: String},
  mimeType: {type: String},
  size: {type: Number},
}, { _id: false });

const willDeedSchema = new mongoose.Schema({
  meta: { type: mongoose.Schema.Types.Mixed, required: false, default: {} },
  testator: { type: mongoose.Schema.Types.Mixed, required: false, default: {} },
  beneficiaries: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  executors: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  witnesses: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  immovables: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  movables: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  rules: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  conditions: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  files: { type: [fileSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
  created_at: { type: Date, default: Date.now },
}, { collection: 'will_deeds' });

const WillDeedModel = mongoose.model("WillDeed", willDeedSchema);

export default WillDeedModel;


