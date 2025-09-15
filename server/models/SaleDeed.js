import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  field: {type: String, required: true},
  path: {type: String, required: true},
  originalName: {type: String},
  mimeType: {type: String},
  size: {type: Number},
}, { _id: false });

const saleDeedSchema = new mongoose.Schema({
  // Basic form data
  documentType: { type: String, required: true },
  propertyType: { type: String, required: true },
  plotType: { type: String, required: false },
  salePrice: { type: Number, required: true },
  circleRateAmount: { type: Number, required: true },
  
  // Property area information
  areaInputType: { type: String, default: 'total' },
  area: { type: Number, required: false },
  areaUnit: { type: String, default: 'sq_meters' },
  propertyLength: { type: Number, required: false },
  propertyWidth: { type: Number, required: false },
  dimUnit: { type: String, default: 'meters' },
  
  // Buildup details
  buildupType: { type: String, required: false },
  numShops: { type: Number, default: 1 },
  numFloorsMall: { type: Number, default: 1 },
  numFloorsMulti: { type: Number, default: 1 },
  superAreaMulti: { type: Number, required: false },
  coveredAreaMulti: { type: Number, required: false },
  
  // Agriculture details
  nalkoopCount: { type: Number, default: 0 },
  borewellCount: { type: Number, default: 0 },
  
  // Property description
  state: { type: String, required: true },
  district: { type: String, required: true },
  tehsil: { type: String, required: true },
  village: { type: String, required: true },
  khasraNo: { type: String, required: false },
  plotNo: { type: String, required: false },
  colonyName: { type: String, required: false },
  wardNo: { type: String, required: false },
  streetNo: { type: String, required: false },
  roadSize: { type: Number, required: false },
  roadUnit: { type: String, default: 'meter' },
  doubleSideRoad: { type: Boolean, default: false },
  
  // Property directions
  directionNorth: { type: String, required: false },
  directionEast: { type: String, required: false },
  directionSouth: { type: String, required: false },
  directionWest: { type: String, required: false },
  
  // Common facilities
  coveredParkingCount: { type: Number, default: 0 },
  openParkingCount: { type: Number, default: 0 },
  
  // Deductions
  deductionType: { type: String, required: false },
  otherDeductionPercent: { type: Number, required: false },
  
  // Dynamic arrays stored as JSON
  sellers: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  buyers: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  witnesses: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  rooms: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  trees: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  shops: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  mallFloors: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  facilities: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  dynamicFacilities: { type: mongoose.Schema.Types.Mixed, required: false, default: [] },
  
  // Calculation results
  calculations: { type: mongoose.Schema.Types.Mixed, required: false, default: {} },
  
  // File uploads
  files: { type: [fileSchema], default: [] },
  
  // Metadata
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { collection: 'sale_deeds' });

// Update the updated_at field before saving
saleDeedSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const SaleDeedModel = mongoose.model("SaleDeed", saleDeedSchema);

export default SaleDeedModel;
