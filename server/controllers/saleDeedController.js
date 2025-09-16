// import SaleDeedModel from "../models/SaleDeed.js";

// class SaleDeedController {
//   // Create a new sale deed
//   static create = async (req, res) => {
//     try {
//       // JSON comes in 'data' field as application/json blob
//       let parsed;
//       try {
//         parsed = req.body.data ? JSON.parse(req.body.data) : req.body;
//       } catch (e) {
//         return res.status(400).json({ 
//           status: "failed", 
//           message: "Invalid JSON in 'data' field" 
//         });
//       }

//       const files = (req.files || []).map(f => ({
//         field: f.fieldname,
//         path: f.path.replace(/\\/g, '/'),
//         originalName: f.originalname,
//         mimeType: f.mimetype,
//         size: f.size,
//       }));

//       const createdBy = req.user?._id || null;

//       // Create the sale deed document
//       const doc = await SaleDeedModel.create({
//         // Basic form data
//         documentType: parsed.documentType,
//         propertyType: parsed.propertyType,
//         plotType: parsed.plotType,
//         salePrice: parsed.salePrice,
//         circleRateAmount: parsed.circleRateAmount,

//         // Property area information
//         areaInputType: parsed.areaInputType,
//         area: parsed.area,
//         areaUnit: parsed.areaUnit,
//         propertyLength: parsed.propertyLength,
//         propertyWidth: parsed.propertyWidth,
//         dimUnit: parsed.dimUnit,

//         // Buildup details
//         buildupType: parsed.buildupType,
//         numShops: parsed.numShops,
//         numFloorsMall: parsed.numFloorsMall,
//         numFloorsMulti: parsed.numFloorsMulti,
//         superAreaMulti: parsed.superAreaMulti,
//         coveredAreaMulti: parsed.coveredAreaMulti,

//         // Agriculture details
//         nalkoopCount: parsed.nalkoopCount,
//         borewellCount: parsed.borewellCount,

//         // Property description
//         state: parsed.state,
//         district: parsed.district,
//         tehsil: parsed.tehsil,
//         village: parsed.village,
//         khasraNo: parsed.khasraNo,
//         plotNo: parsed.plotNo,
//         colonyName: parsed.colonyName,
//         wardNo: parsed.wardNo,
//         streetNo: parsed.streetNo,
//         roadSize: parsed.roadSize,
//         roadUnit: parsed.roadUnit,
//         doubleSideRoad: parsed.doubleSideRoad,

//         // Property directions
//         directionNorth: parsed.directionNorth,
//         directionEast: parsed.directionEast,
//         directionSouth: parsed.directionSouth,
//         directionWest: parsed.directionWest,

//         // Common facilities
//         coveredParkingCount: parsed.coveredParkingCount,
//         openParkingCount: parsed.openParkingCount,

//         // Deductions
//         deductionType: parsed.deductionType,
//         otherDeductionPercent: parsed.otherDeductionPercent,

//         // Dynamic arrays
//         sellers: parsed.sellers || [],
//         buyers: parsed.buyers || [],
//         witnesses: parsed.witnesses || [],
//         rooms: parsed.rooms || [],
//         trees: parsed.trees || [],
//         shops: parsed.shops || [],
//         mallFloors: parsed.mallFloors || [],
//         facilities: parsed.facilities || [],
//         dynamicFacilities: parsed.dynamicFacilities || [],

//         // Calculation results
//         calculations: parsed.calculations || {},

//         // Files and metadata
//         files,
//         createdBy,
//       });

//       return res.status(201).json({ 
//         status: "success", 
//         message: "Sale Deed saved successfully", 
//         id: doc._id, 
//         files: doc.files 
//       });
//     } catch (error) {
//       console.error("Error creating sale deed:", error);
//       return res.status(500).json({ 
//         status: "failed", 
//         message: "Unable to save sale deed",
//         error: error.message 
//       });
//     }
//   };

//   // Get all sale deeds (with pagination and filtering)
//   static getAll = async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const skip = (page - 1) * limit;

//       // Build filter object
//       const filter = {};
//       if (req.query.propertyType) {
//         filter.propertyType = req.query.propertyType;
//       }
//       if (req.query.documentType) {
//         filter.documentType = req.query.documentType;
//       }
//       if (req.query.state) {
//         filter.state = new RegExp(req.query.state, 'i');
//       }
//       if (req.query.district) {
//         filter.district = new RegExp(req.query.district, 'i');
//       }
//       if (req.user && req.user.role === 'user') {
//         filter.createdBy = req.user._id;
//       }

//       const saleDeeds = await SaleDeedModel.find(filter)
//         .populate('createdBy', 'name email')
//         .sort({ created_at: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean();

//       const total = await SaleDeedModel.countDocuments(filter);

//       return res.status(200).json({
//         status: "success",
//         data: saleDeeds,
//         pagination: {
//           current: page,
//           pages: Math.ceil(total / limit),
//           total: total
//         }
//       });
//     } catch (error) {
//       console.error("Error fetching sale deeds:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to fetch sale deeds",
//         error: error.message
//       });
//     }
//   };

//   // Get a single sale deed by ID
//   static getById = async (req, res) => {
//     try {
//       const { id } = req.params;

//       const saleDeed = await SaleDeedModel.findById(id)
//         .populate('createdBy', 'name email')
//         .lean();

//       if (!saleDeed) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Sale deed not found"
//         });
//       }

//       // Check if user has permission to view this sale deed
//       if (req.user && req.user.role === 'user' && saleDeed.createdBy?._id.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Access denied"
//         });
//       }

//       return res.status(200).json({
//         status: "success",
//         data: saleDeed
//       });
//     } catch (error) {
//       console.error("Error fetching sale deed:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to fetch sale deed",
//         error: error.message
//       });
//     }
//   };

//   // Update a sale deed
//   static update = async (req, res) => {
//     try {
//       const { id } = req.params;

//       // Check if sale deed exists
//       const existingSaleDeed = await SaleDeedModel.findById(id);
//       if (!existingSaleDeed) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Sale deed not found"
//         });
//       }

//       // Check if user has permission to update this sale deed
//       if (req.user && req.user.role === 'user' && existingSaleDeed.createdBy?.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Access denied"
//         });
//       }

//       // Parse the update data
//       let parsed;
//       try {
//         parsed = req.body.data ? JSON.parse(req.body.data) : req.body;
//       } catch (e) {
//         return res.status(400).json({
//           status: "failed",
//           message: "Invalid JSON in 'data' field"
//         });
//       }

//       // Handle file uploads
//       const newFiles = (req.files || []).map(f => ({
//         field: f.fieldname,
//         path: f.path.replace(/\\/g, '/'),
//         originalName: f.originalname,
//         mimeType: f.mimetype,
//         size: f.size,
//       }));

//       // Update the sale deed
//       const updatedSaleDeed = await SaleDeedModel.findByIdAndUpdate(
//         id,
//         {
//           ...parsed,
//           files: [...existingSaleDeed.files, ...newFiles],
//           updated_at: Date.now()
//         },
//         { new: true, runValidators: true }
//       ).populate('createdBy', 'name email');

//       return res.status(200).json({
//         status: "success",
//         message: "Sale deed updated successfully",
//         data: updatedSaleDeed
//       });
//     } catch (error) {
//       console.error("Error updating sale deed:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to update sale deed",
//         error: error.message
//       });
//     }
//   };

//   // Delete a sale deed
//   static delete = async (req, res) => {
//     try {
//       const { id } = req.params;

//       // Check if sale deed exists
//       const existingSaleDeed = await SaleDeedModel.findById(id);
//       if (!existingSaleDeed) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Sale deed not found"
//         });
//       }

//       // Check if user has permission to delete this sale deed
//       if (req.user && req.user.role === 'user' && existingSaleDeed.createdBy?.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Access denied"
//         });
//       }

//       await SaleDeedModel.findByIdAndDelete(id);

//       return res.status(200).json({
//         status: "success",
//         message: "Sale deed deleted successfully"
//       });
//     } catch (error) {
//       console.error("Error deleting sale deed:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to delete sale deed",
//         error: error.message
//       });
//     }
//   };

//   // Get statistics for dashboard
//   static getStats = async (req, res) => {
//     try {
//       const filter = {};
//       if (req.user && req.user.role === 'user') {
//         filter.createdBy = req.user._id;
//       }

//       const stats = await SaleDeedModel.aggregate([
//         { $match: filter },
//         {
//           $group: {
//             _id: null,
//             total: { $sum: 1 },
//             totalSaleValue: { $sum: "$salePrice" },
//             avgSaleValue: { $avg: "$salePrice" },
//             byPropertyType: {
//               $push: "$propertyType"
//             },
//             byDocumentType: {
//               $push: "$documentType"
//             }
//           }
//         }
//       ]);

//       const propertyTypeStats = await SaleDeedModel.aggregate([
//         { $match: filter },
//         {
//           $group: {
//             _id: "$propertyType",
//             count: { $sum: 1 }
//           }
//         }
//       ]);

//       const documentTypeStats = await SaleDeedModel.aggregate([
//         { $match: filter },
//         {
//           $group: {
//             _id: "$documentType",
//             count: { $sum: 1 }
//           }
//         }
//       ]);

//       const result = {
//         total: stats[0]?.total || 0,
//         totalSaleValue: stats[0]?.totalSaleValue || 0,
//         avgSaleValue: stats[0]?.avgSaleValue || 0,
//         propertyTypeBreakdown: propertyTypeStats,
//         documentTypeBreakdown: documentTypeStats
//       };

//       return res.status(200).json({
//         status: "success",
//         data: result
//       });
//     } catch (error) {
//       console.error("Error fetching stats:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to fetch statistics",
//         error: error.message
//       });
//     }
//   };
// }

// export default SaleDeedController;


// const SaleDeed = require('../models/SaleDeed');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.join(__dirname, '..', 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: function (req, file, cb) {
//     const filetypes = /jpeg|jpg|png|pdf/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     }
//     cb(new Error('Only images (JPEG/PNG) and PDFs are allowed'));
//   }
// }).array('files', 10);

// exports.createSaleDeed = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }

//     try {
//       const data = JSON.parse(req.body.data);
//       const files = req.files.map(file => ({
//         filename: file.filename,
//         contentType: file.mimetype,
//         size: file.size,
//         path: file.path
//       }));

//       const saleDeed = new SaleDeed({
//         ...data,
//         files,
//         createdBy: req.user ? req.user.id : null // Assuming user auth middleware
//       });

//       await saleDeed.save();
//       res.status(201).json({ message: 'Sale deed created successfully', saleDeed });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
// };

// exports.getSaleDeed = async (req, res) => {
//   try {
//     const saleDeed = await SaleDeed.findById(req.params.id);
//     if (!saleDeed) {
//       return res.status(404).json({ error: 'Sale deed not found' });
//     }
//     res.json(saleDeed);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getAllSaleDeeds = async (req, res) => {
//   try {
//     const saleDeeds = await SaleDeed.find({ createdBy: req.user.id });
//     res.json(saleDeeds);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateSaleDeed = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ error: err.message });
//     }

//     try {
//       const data = JSON.parse(req.body.data);
//       const files = req.files.map(file => ({
//         filename: file.filename,
//         contentType: file.mimetype,
//         size: file.size,
//         path: file.path
//       }));

//       const saleDeed = await SaleDeed.findById(req.params.id);
//       if (!saleDeed) {
//         return res.status(404).json({ error: 'Sale deed not found' });
//       }

//       // Remove old files if new ones are uploaded
//       if (files.length > 0 && saleDeed.files) {
//         saleDeed.files.forEach(file => {
//           if (fs.existsSync(file.path)) {
//             fs.unlinkSync(file.path);
//           }
//         });
//       }

//       const updatedSaleDeed = await SaleDeed.findByIdAndUpdate(
//         req.params.id,
//         { ...data, files, updatedAt: Date.now() },
//         { new: true }
//       );

//       res.json({ message: 'Sale deed updated successfully', saleDeed: updatedSaleDeed });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
// };

// exports.deleteSaleDeed = async (req, res) => {
//   try {
//     const saleDeed = await SaleDeed.findById(req.params.id);
//     if (!saleDeed) {
//       return res.status(404).json({ error: 'Sale deed not found' });
//     }

//     // Delete associated files
//     if (saleDeed.files) {
//       saleDeed.files.forEach(file => {
//         if (fs.existsSync(file.path)) {
//           fs.unlinkSync(file.path);
//         }
//       });
//     }

//     await SaleDeed.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Sale deed deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

import SaleDeed from '../models/SaleDeed.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (JPEG/PNG) and PDFs are allowed'));
  }
}).array('files', 10);

export const createSaleDeed = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const data = JSON.parse(req.body.data);
      const files = req.files.map(file => ({
        filename: file.filename,
        contentType: file.mimetype,
        size: file.size,
        path: file.path
      }));

      const saleDeed = new SaleDeed({
        ...data,
        files,
        createdBy: req.user ? req.user.id : null
      });

      await saleDeed.save();
      res.status(201).json({ message: 'Sale deed created successfully', saleDeed });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

export const getSaleDeed = async (req, res) => {
  try {
    const saleDeed = await SaleDeed.findById(req.params.id);
    if (!saleDeed) return res.status(404).json({ error: 'Sale deed not found' });
    res.json(saleDeed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllSaleDeeds = async (req, res) => {
  try {
    const saleDeeds = await SaleDeed.find({ createdBy: req.user.id });
    res.json(saleDeeds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSaleDeed = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const data = JSON.parse(req.body.data);
      const files = req.files.map(file => ({
        filename: file.filename,
        contentType: file.mimetype,
        size: file.size,
        path: file.path
      }));

      const saleDeed = await SaleDeed.findById(req.params.id);
      if (!saleDeed) return res.status(404).json({ error: 'Sale deed not found' });

      // Remove old files if new ones uploaded
      if (files.length > 0 && saleDeed.files) {
        saleDeed.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }

      const updatedSaleDeed = await SaleDeed.findByIdAndUpdate(
        req.params.id,
        { ...data, files, updatedAt: Date.now() },
        { new: true }
      );

      res.json({ message: 'Sale deed updated successfully', saleDeed: updatedSaleDeed });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

export const deleteSaleDeed = async (req, res) => {
  try {
    const saleDeed = await SaleDeed.findById(req.params.id);
    if (!saleDeed) return res.status(404).json({ error: 'Sale deed not found' });

    if (saleDeed.files) {
      saleDeed.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    await SaleDeed.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sale deed deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
