// import mongoose from "mongoose";

// const fileSchema = new mongoose.Schema({
//   field: {type: String, required: true},
//   path: {type: String, required: true},
//   originalName: {type: String},
//   mimeType: {type: String},
//   size: {type: Number},
// }, { _id: false });

// const trusteeSchema = new mongoose.Schema({
//   salutation: { type: String, required: true, enum: ['श्री', 'श्रीमती'] },
//   position: { type: String, required: true, enum: ['अध्यक्ष', 'सचिव', 'कोषाध्यक्ष', 'सदस्य'] },
//   name: { type: String, required: true, maxlength: 100 },
//   relation: { type: String, required: true, maxlength: 100 }, // पिता/पति का नाम
//   address: { type: String, required: true, maxlength: 500 },
//   mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
//   idType: { type: String, required: true, enum: ['आधार कार्ड', 'पैन कार्ड'] },
//   idNumber: { type: String, required: true, maxlength: 20 },
//   idCardFile: { type: String }, // File path
//   photoFile: { type: String }, // File path
// }, { _id: false });

// const witnessSchema = new mongoose.Schema({
//   name: { type: String, maxlength: 100 },
//   relation: { type: String, maxlength: 100 }, // पिता/पति का नाम
//   address: { type: String, maxlength: 500 },
//   mobile: { type: String, match: /^[6-9]\d{9}$/ },
//   idType: { type: String, enum: ['आधार कार्ड', 'पैन कार्ड'] },
//   idNumber: { type: String, maxlength: 20 },
//   idCardFile: { type: String }, // File path
//   photoFile: { type: String }, // File path
// }, { _id: false });

// const trustDeedSchema = new mongoose.Schema({
//   // Trust Details
//   trustName: { type: String, required: true, maxlength: 100 },
//   trustAddress: { type: String, required: true, maxlength: 500 },

//   // Initial Amount
//   startingAmount: {
//     number: { type: String, required: true },
//     words: { type: String, required: true, maxlength: 200 }
//   },

//   // Trustees (dynamic array)
//   trustees: [trusteeSchema],

//   // Functional Domains (dynamic array)
//   functionalDomains: [{ type: String, maxlength: 200 }],

//   // Purposes (predefined checkboxes + custom)
//   purposes: [{ type: String, maxlength: 200 }],
//   otherPurposes: [{ type: String, maxlength: 200 }],

//   // Terms and Conditions (predefined checkboxes + custom)
//   terms: [{ type: String, maxlength: 200 }],
//   otherTerms: [{ type: String, maxlength: 200 }],

//   // Witnesses
//   witnesses: [witnessSchema],

//   // File uploads
//   files: { type: [fileSchema], default: [] },

//   // Metadata
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// }, { collection: 'trust_deeds' });

// // Update the updated_at field before saving
// trustDeedSchema.pre('save', function(next) {
//   this.updated_at = Date.now();
//   next();
// });

// // Indexes for better query performance
// trustDeedSchema.index({ trustName: 1 });
// trustDeedSchema.index({ createdBy: 1 });
// trustDeedSchema.index({ created_at: -1 });

// const TrustDeedModel = mongoose.model("TrustDeed", trustDeedSchema);

// export default TrustDeedModel;

import mongoose from "mongoose";

const trusteeSchema = new mongoose.Schema({
  salutation: { type: String, required: true, enum: ["श्री", "श्रीमती"] },
  position: { type: String, required: true, enum: ["अध्यक्ष", "सचिव", "कोषाध्यक्ष", "सदस्य"] },
  name: { type: String, required: true, trim: true, maxLength: 100 },
  relation: { type: String, required: true, trim: true, maxLength: 100 },
  address: { type: String, required: true, trim: true, maxLength: 500 },
  mobile: { type: String, required: true, match: /^[6-9]\d{9}$/ },
  idType: { type: String, required: true, enum: ["आधार कार्ड", "पैन कार्ड"] },
  idNumber: { type: String, required: true, trim: true, maxLength: 20 },
  idCard: { type: String }, // Filename for ID card upload
  photo: { type: String }, // Filename for photo upload
});

const witnessSchema = new mongoose.Schema({
  name: { type: String, trim: true, maxLength: 100 },
  relation: { type: String, trim: true, maxLength: 100 },
  address: { type: String, trim: true, maxLength: 500 },
  mobile: { type: String, match: /^[6-9]\d{9}$/ },
  idType: { type: String, enum: ["आधार कार्ड", "पैन कार्ड"] },
  idNumber: { type: String, trim: true, maxLength: 20 },
  idCard: { type: String }, // Filename for ID card upload
  photo: { type: String }, // Filename for photo upload
});

const trustDeedSchema = new mongoose.Schema({
  trustName: { type: String, required: true, trim: true, maxLength: 100 },
  trustAddress: { type: String, required: true, trim: true, maxLength: 500 },
  startingAmount: {
    number: { type: String, required: true, match: /^\d+$/ },
    words: { type: String, required: true },
  },
  trustees: { type: [trusteeSchema], required: true, validate: [v => v.length >= 1, "At least one trustee is required"] },
  functionalDomains: [{ type: String, trim: true, maxLength: 200 }],
  purposes: [{ type: String, trim: true, maxLength: 200 }],
  otherPurposes: [{ type: String, trim: true, maxLength: 200 }],
  terms: [{ type: String, trim: true, maxLength: 200 }],
  otherTerms: [{ type: String, trim: true, maxLength: 200 }],
  witnesses: { type: [witnessSchema], default: [] },
  meta: {
    status: { type: String, enum: ["draft", "submitted", "approved", "rejected"], default: "submitted" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
});

const TrustDeed = mongoose.model("TrustDeed", trustDeedSchema);

export default TrustDeed;