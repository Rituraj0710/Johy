// import mongoose from "mongoose";

// const fileSchema = new mongoose.Schema({
//   filename: { type: String, required: true },
//   filepath: { type: String, required: true },
//   mimetype: { type: String, required: true },
//   size: { type: Number, required: true },
//   uploadedAt: { type: Date, default: Date.now }
// });

// const propertySaleCertificateSchema = new mongoose.Schema({
//   // Bank/Secured Creditor Information
//   bank_select: { type: String, required: true, trim: true },
//   bank_other: { type: String, trim: true },
//   bank_reg_off: { type: String, required: true, trim: true },
//   bank_head_off: { type: String, required: true, trim: true },
//   bank_pan: { type: String, trim: true },
//   bank_post: { type: String, trim: true },

//   // Bank Representative Information
//   bank_rep_title: { type: String, required: true, enum: ['श्री', 'श्रीमती', 'सुश्री'], default: 'श्री' },
//   bank_rep_name: { type: String, required: true, trim: true },
//   bank_rep_rel: { type: String, required: true, enum: ['पुत्र', 'पत्नी', 'पुत्री', 'पुत्र/पुत्री', 'पत्नी/पति', 'अन्य'], default: 'पुत्र' },
//   bank_rep_father_name: { type: String, required: true, trim: true },
//   bank_rep_occ: { type: String, trim: true },
//   bank_rep_mobile: { type: String, required: true, match: /^[0-9]{10}$/ },
//   bank_rep_email: { type: String, trim: true, lowercase: true },
//   bank_rep_addr: { type: String, required: true, trim: true },
//   bank_rep_photo: { type: String }, // File path

//   // Acknowledgement Receipt
//   ack_amount: { type: Number, required: true, min: 0 },
//   ack_amount_words: { type: String, trim: true },

//   // Previous Owner Information
//   previous_owner: { type: String, required: true, trim: true },
//   acquisition_mode: { type: String, required: true, trim: true },
//   bank_power: { type: String, required: true, trim: true },

//   // Property Details
//   prop_category: { type: String, required: true, enum: ['Residential', 'Commercial', 'Industrial', 'Agriculture'] },
//   prop_subtype: { type: String, required: true, trim: true },
//   construction_type: { type: String, trim: true },
//   prop_state: { type: String, default: 'Uttar Pradesh', trim: true },
//   prop_tehsil: { type: String, required: true, trim: true },
//   prop_ward: { type: String, required: true, trim: true },
//   prop_khasra: { type: String, trim: true },
//   prop_plot: { type: String, trim: true },
//   prop_flat_floor: { type: String, trim: true },
//   covered_area: { type: Number, min: 0 },
//   super_area: { type: Number, min: 0 },
//   plot_area_val: { type: Number, min: 0 },
//   plot_area_unit: { type: String, enum: ['sqft', 'sqyd', 'sqm'], default: 'sqm' },
//   plot_area_sqm: { type: Number, min: 0 },
//   road_size_val: { type: Number, min: 0 },
//   road_size_unit: { type: String, enum: ['sqft', 'sqyd', 'sqm'], default: 'sqm' },
//   road_size_m: { type: Number, min: 0 },
//   road_double: { type: Boolean, default: false },
//   park_facing: { type: Boolean, default: false },
//   corner_plot: { type: Boolean, default: false },
//   prop_address: { type: String, required: true, trim: true },
//   prop_photo: { type: String }, // File path

//   // Boundary Details
//   bd_north: { type: String, required: true, trim: true },
//   bd_south: { type: String, required: true, trim: true },
//   bd_east: { type: String, required: true, trim: true },
//   bd_west: { type: String, required: true, trim: true },

//   // Circle Rate and Stamp Duty
//   circle_rate: { type: Number, required: true, min: 0 },
//   circle_rate_value: { type: Number, min: 0 },
//   stamp_duty: { type: Number, required: true, min: 0 },
//   registration_fee: { type: Number, min: 0 },
//   total_property_cost: { type: Number, min: 0 },
//   stamp_no: { type: String, required: true, trim: true },
//   stamp_amount_manual: { type: Number, required: true, min: 0 },
//   stamp_date: { type: Date, required: true },

//   // Legal Details
//   legal_rule_select: { type: String, required: true, trim: true },
//   legal_clauses: { type: String, required: true, trim: true },
//   power_authority: [{ type: String }], // Array of selected authorities

//   // Agreement Details
//   agreement_no: { type: String, required: true, trim: true },
//   agreement_date: { type: Date, required: true },
//   payment_terms: { type: String, required: true, trim: true },

//   // Payment totals
//   total_amount: { type: Number, min: 0 },
//   total_words: { type: String, trim: true },
//   currency_label: { type: String, default: 'रुपये मात्र', trim: true },

//   // Other Details
//   advocate_name: { type: String, required: true, trim: true },
//   draft_date: { type: Date, required: true },

//   // Dynamic arrays (stored as JSON)
//   purchasers: [{
//     id: { type: Number },
//     title: { type: String, enum: ['श्री', 'श्रीमती', 'सुश्री'] },
//     name: { type: String, trim: true },
//     rel: { type: String, enum: ['पुत्र', 'पत्नी', 'पुत्री', 'पुत्र/पुत्री', 'पत्नी/पति', 'अन्य'] },
//     father_name: { type: String, trim: true },
//     addr: { type: String, trim: true },
//     idtype: { type: String, enum: ['आधार', 'पैन', 'पासपोर्ट', 'ड्राइविंग लाइसेंस'] },
//     idno: { type: String, trim: true },
//     occ: { type: String, trim: true },
//     pan: { type: String, trim: true },
//     mobile: { type: String, match: /^[0-9]{10}$/ },
//     email: { type: String, trim: true, lowercase: true },
//     photo: { type: String } // File path
//   }],
//   witnesses: [{
//     id: { type: Number },
//     title: { type: String, enum: ['श्री', 'श्रीमती', 'सुश्री'] },
//     name: { type: String, trim: true },
//     rel: { type: String, enum: ['पुत्र', 'पत्नी', 'पुत्री', 'पुत्र/पुत्री', 'पत्नी/पति', 'अन्य'] },
//     father_name: { type: String, trim: true },
//     addr: { type: String, trim: true },
//     idtype: { type: String, enum: ['आधार', 'पासपोर्ट', 'ड्राइविंग लाइसेंस'] },
//     idno: { type: String, trim: true },
//     occ: { type: String, trim: true },
//     mobile: { type: String, match: /^[0-9]{10}$/ },
//     photo: { type: String } // File path
//   }],
//   payments: [{
//     id: { type: Number },
//     amount: { type: Number, min: 0 },
//     mode: { type: String, trim: true },
//     ref: { type: String, trim: true },
//     date: { type: Date },
//     bank: { type: String, trim: true }
//   }],
//   floors: [mongoose.Schema.Types.Mixed], // Keep flexible for future use

//   // File uploads metadata
//   file_uploads: {
//     bank_rep_photo: { type: String },
//     prop_photo: { type: String },
//     purchaser_photos: [{ type: String }],
//     witness_photos: [{ type: String }]
//   },

//   // Metadata
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
//   created_at: { type: Date, default: Date.now },
//   updated_at: { type: Date, default: Date.now },
// }, { collection: 'property_sale_certificates' });

// // Indexes for better query performance
// propertySaleCertificateSchema.index({ bank_rep_mobile: 1 });
// propertySaleCertificateSchema.index({ prop_address: 1 });
// propertySaleCertificateSchema.index({ prop_category: 1 });
// propertySaleCertificateSchema.index({ agreement_no: 1 });
// propertySaleCertificateSchema.index({ stamp_no: 1 });
// propertySaleCertificateSchema.index({ createdBy: 1 });
// propertySaleCertificateSchema.index({ created_at: -1 });

// // Pre-save middleware to update the updated_at field
// propertySaleCertificateSchema.pre('save', function(next) {
//   this.updated_at = Date.now();
//   next();
// });

// const PropertySaleCertificateModel = mongoose.model("PropertySaleCertificate", propertySaleCertificateSchema);

// export default PropertySaleCertificateModel;
import mongoose from 'mongoose';

const purchaserSchema = new mongoose.Schema({
  title: { type: String },
  name: { type: String },
  rel: { type: String },
  father_name: { type: String },
  addr: { type: String },
  idtype: { type: String },
  idno: { type: String },
  occ: { type: String },
  pan: { type: String },
  mobile: { type: String },
  email: { type: String },
  photo: { type: String } // Path to uploaded photo
});

const paymentSchema = new mongoose.Schema({
  amount: { type: Number },
  mode: { type: String },
  ref: { type: String },
  date: { type: Date },
  bank: { type: String }
});

const witnessSchema = new mongoose.Schema({
  title: { type: String },
  name: { type: String },
  rel: { type: String },
  father_name: { type: String },
  addr: { type: String },
  idtype: { type: String },
  idno: { type: String },
  occ: { type: String },
  mobile: { type: String },
  photo: { type: String } // Path to uploaded photo
});

const propertySaleCertificateSchema = new mongoose.Schema({
  bank_select: { type: String, required: true },
  bank_other: { type: String },
  bank_reg_off: { type: String, required: true },
  bank_head_off: { type: String, required: true },
  bank_pan: { type: String },
  bank_post: { type: String },
  bank_rep_title: { type: String },
  bank_rep_name: { type: String, required: true },
  bank_rep_rel: { type: String },
  bank_rep_father_name: { type: String, required: true },
  bank_rep_occ: { type: String },
  bank_rep_mobile: { type: String, required: true },
  bank_rep_email: { type: String },
  bank_rep_addr: { type: String, required: true },
  bank_rep_photo: { type: String },
  ack_amount: { type: Number },
  ack_amount_words: { type: String },
  previous_owner: { type: String },
  acquisition_mode: { type: String },
  bank_power: { type: String },
  prop_category: { type: String, required: true },
  prop_subtype: { type: String, required: true },
  construction_type: { type: String },
  prop_state: { type: String, required: true },
  prop_tehsil: { type: String, required: true },
  prop_ward: { type: String, required: true },
  prop_khasra: { type: String },
  prop_plot: { type: String },
  prop_flat_floor: { type: String },
  covered_area: { type: Number },
  super_area: { type: Number },
  plot_area_val: { type: Number },
  plot_area_unit: { type: String },
  plot_area_sqm: { type: Number },
  road_size_val: { type: Number },
  road_size_unit: { type: String },
  road_size_m: { type: Number },
  road_double: { type: Boolean },
  park_facing: { type: Boolean },
  corner_plot: { type: Boolean },
  prop_address: { type: String, required: true },
  prop_photo: { type: String },
  bd_north: { type: String },
  bd_south: { type: String },
  bd_east: { type: String },
  bd_west: { type: String },
  circle_rate: { type: Number },
  circle_rate_value: { type: Number },
  stamp_duty: { type: Number },
  registration_fee: { type: Number },
  total_property_cost: { type: Number },
  stamp_no: { type: String },
  stamp_amount_manual: { type: Number },
  stamp_date: { type: Date },
  legal_rule_select: { type: String },
  legal_clauses: { type: String },
  power_authority: [{ type: String }],
  agreement_no: { type: String },
  agreement_date: { type: Date },
  payment_terms: { type: String },
  advocate_name: { type: String },
  draft_date: { type: Date },
  total_amount: { type: Number },
  total_words: { type: String },
  currency_label: { type: String },
  purchasers: [purchaserSchema],
  payments: [paymentSchema],
  witnesses: [witnessSchema]
}, { timestamps: true });

const PropertySaleCertificate = mongoose.model('PropertySaleCertificate', propertySaleCertificateSchema);

export default PropertySaleCertificate;