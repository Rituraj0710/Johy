import PropertySaleCertificateModel from "../models/PropertySaleCertificate.js";
import { validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';

class PropertySaleCertificateController {
  static create = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: "failed", 
        message: "Validation failed", 
        errors: errors.array() 
      });
    }

    try {
      // Extract all form fields from request body
      const {
        // Bank/Secured Creditor Information
        bank_select, bank_other, bank_reg_off, bank_head_off, bank_pan, bank_post,
        
        // Bank Representative Information
        bank_rep_title, bank_rep_name, bank_rep_rel, bank_rep_father_name, 
        bank_rep_occ, bank_rep_mobile, bank_rep_email, bank_rep_addr,
        
        // Acknowledgement Receipt
        ack_amount, ack_amount_words,
        
        // Previous Owner Information
        previous_owner, acquisition_mode, bank_power,
        
        // Property Details
        prop_category, prop_subtype, construction_type, prop_state, prop_tehsil, 
        prop_ward, prop_khasra, prop_plot, prop_flat_floor, covered_area, 
        super_area, plot_area_val, plot_area_unit, plot_area_sqm, road_size_val, 
        road_size_unit, road_size_m, road_double, park_facing, corner_plot, 
        prop_address,
        
        // Boundary Details
        bd_north, bd_south, bd_east, bd_west,
        
        // Circle Rate and Stamp Duty
        circle_rate, circle_rate_value, stamp_duty, registration_fee, 
        total_property_cost, stamp_no, stamp_amount_manual, stamp_date,
        
        // Legal Details
        legal_rule_select, legal_clauses, power_authority,
        
        // Agreement Details
        agreement_no, agreement_date, payment_terms,
        
        // Payment totals
        total_amount, total_words, currency_label,
        
        // Other Details
        advocate_name, draft_date,
        
        // Dynamic arrays
        purchasers, witnesses, payments, floors
      } = req.body;

      const createdBy = req.user?._id || null;

      // Handle file uploads
      const fileUploads = {
        bank_rep_photo: null,
        prop_photo: null,
        purchaser_photos: [],
        witness_photos: []
      };

      // Process main file uploads
      if (req.files) {
        if (req.files['bank_rep_photo']) {
          fileUploads.bank_rep_photo = req.files['bank_rep_photo'][0].path;
        }
        if (req.files['prop_photo']) {
          fileUploads.prop_photo = req.files['prop_photo'][0].path;
        }

        // Process purchaser photos
        purchasers.forEach((purchaser, index) => {
          const photoKey = `purchaser_photo_${purchaser.id}`;
          if (req.files[photoKey]) {
            fileUploads.purchaser_photos.push(req.files[photoKey][0].path);
          }
        });

        // Process witness photos
        witnesses.forEach((witness, index) => {
          const photoKey = `witness_photo_${witness.id}`;
          if (req.files[photoKey]) {
            fileUploads.witness_photos.push(req.files[photoKey][0].path);
          }
        });
      }

      // Parse JSON arrays if they come as strings
      let parsedPurchasers = purchasers;
      let parsedWitnesses = witnesses;
      let parsedPayments = payments;
      let parsedFloors = floors;

      if (typeof purchasers === 'string') {
        try {
          parsedPurchasers = JSON.parse(purchasers);
        } catch (e) {
          console.error('Error parsing purchasers:', e);
        }
      }

      if (typeof witnesses === 'string') {
        try {
          parsedWitnesses = JSON.parse(witnesses);
        } catch (e) {
          console.error('Error parsing witnesses:', e);
        }
      }

      if (typeof payments === 'string') {
        try {
          parsedPayments = JSON.parse(payments);
        } catch (e) {
          console.error('Error parsing payments:', e);
        }
      }

      if (typeof floors === 'string') {
        try {
          parsedFloors = JSON.parse(floors);
        } catch (e) {
          console.error('Error parsing floors:', e);
        }
      }

      // Create the document
      const doc = await PropertySaleCertificateModel.create({
        // Bank/Secured Creditor Information
        bank_select, bank_other, bank_reg_off, bank_head_off, bank_pan, bank_post,
        
        // Bank Representative Information
        bank_rep_title, bank_rep_name, bank_rep_rel, bank_rep_father_name, 
        bank_rep_occ, bank_rep_mobile, bank_rep_email, bank_rep_addr,
        
        // Acknowledgement Receipt
        ack_amount, ack_amount_words,
        
        // Previous Owner Information
        previous_owner, acquisition_mode, bank_power,
        
        // Property Details
        prop_category, prop_subtype, construction_type, prop_state, prop_tehsil, 
        prop_ward, prop_khasra, prop_plot, prop_flat_floor, covered_area, 
        super_area, plot_area_val, plot_area_unit, plot_area_sqm, road_size_val, 
        road_size_unit, road_size_m, road_double, park_facing, corner_plot, 
        prop_address,
        
        // Boundary Details
        bd_north, bd_south, bd_east, bd_west,
        
        // Circle Rate and Stamp Duty
        circle_rate, circle_rate_value, stamp_duty, registration_fee, 
        total_property_cost, stamp_no, stamp_amount_manual, stamp_date,
        
        // Legal Details
        legal_rule_select, legal_clauses, power_authority,
        
        // Agreement Details
        agreement_no, agreement_date, payment_terms,
        
        // Payment totals
        total_amount, total_words, currency_label,
        
        // Other Details
        advocate_name, draft_date,
        
        // Dynamic arrays
        purchasers: parsedPurchasers,
        witnesses: parsedWitnesses,
        payments: parsedPayments,
        floors: parsedFloors,
        
        // File uploads
        file_uploads: fileUploads,
        
        createdBy,
      });

      return res.status(201).json({ 
        status: "success", 
        message: "Property Sale Certificate saved successfully", 
        id: doc._id 
      });
    } catch (error) {
      console.error("Error saving Property Sale Certificate:", error);
      return res.status(500).json({ 
        status: "failed", 
        message: "Unable to save property sale certificate", 
        error: error.message 
      });
    }
  };

  static getAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};
      if (req.user) {
        query.createdBy = req.user._id;
      }

      // Add search functionality
      if (req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        query.$or = [
          { bank_rep_name: searchRegex },
          { prop_address: searchRegex },
          { agreement_no: searchRegex },
          { stamp_no: searchRegex }
        ];
      }

      // Add filter by property category
      if (req.query.prop_category) {
        query.prop_category = req.query.prop_category;
      }

      // Add date range filter
      if (req.query.start_date && req.query.end_date) {
        query.draft_date = {
          $gte: new Date(req.query.start_date),
          $lte: new Date(req.query.end_date)
        };
      }

      const certificates = await PropertySaleCertificateModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 })
        .populate('createdBy', 'name email');

      const total = await PropertySaleCertificateModel.countDocuments(query);

      return res.status(200).json({
        status: "success",
        message: "Property Sale Certificates retrieved successfully",
        data: certificates,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching Property Sale Certificates:", error);
      return res.status(500).json({ 
        status: "failed", 
        message: "Unable to retrieve property sale certificates", 
        error: error.message 
      });
    }
  };

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      const certificate = await PropertySaleCertificateModel.findById(id)
        .populate('createdBy', 'name email');

      if (!certificate) {
        return res.status(404).json({ 
          status: "failed", 
          message: "Property Sale Certificate not found" 
        });
      }

      // Check authorization
      if (req.user && certificate.createdBy && certificate.createdBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          status: "failed", 
          message: "Unauthorized access" 
        });
      }

      return res.status(200).json({ 
        status: "success", 
        message: "Property Sale Certificate retrieved successfully", 
        data: certificate 
      });
    } catch (error) {
      console.error("Error fetching Property Sale Certificate by ID:", error);
      return res.status(500).json({ 
        status: "failed", 
        message: "Unable to retrieve property sale certificate", 
        error: error.message 
      });
    }
  };

  static update = async (req, res) => {
    try {
      const { id } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          status: "failed", 
          message: "Validation failed", 
          errors: errors.array() 
        });
      }

      const existingCertificate = await PropertySaleCertificateModel.findById(id);
      if (!existingCertificate) {
        return res.status(404).json({ 
          status: "failed", 
          message: "Property Sale Certificate not found" 
        });
      }

      // Check authorization
      if (req.user && existingCertificate.createdBy && existingCertificate.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          status: "failed", 
          message: "Unauthorized access" 
        });
      }

      // Handle file uploads
      if (req.files) {
        const fileUploads = existingCertificate.file_uploads || {};

        // Process main file uploads
        if (req.files['bank_rep_photo']) {
          // Delete old file if exists
          if (fileUploads.bank_rep_photo && fs.existsSync(fileUploads.bank_rep_photo)) {
            try {
              fs.unlinkSync(fileUploads.bank_rep_photo);
            } catch (err) {
              console.error("Error deleting old bank rep photo:", err);
            }
          }
          fileUploads.bank_rep_photo = req.files['bank_rep_photo'][0].path;
        }

        if (req.files['prop_photo']) {
          // Delete old file if exists
          if (fileUploads.prop_photo && fs.existsSync(fileUploads.prop_photo)) {
            try {
              fs.unlinkSync(fileUploads.prop_photo);
            } catch (err) {
              console.error("Error deleting old property photo:", err);
            }
          }
          fileUploads.prop_photo = req.files['prop_photo'][0].path;
        }

        req.body.file_uploads = fileUploads;
      }

      const updatedCertificate = await PropertySaleCertificateModel.findByIdAndUpdate(
        id, 
        req.body, 
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');

      return res.status(200).json({ 
        status: "success", 
        message: "Property Sale Certificate updated successfully", 
        data: updatedCertificate 
      });
    } catch (error) {
      console.error("Error updating Property Sale Certificate:", error);
      return res.status(500).json({ 
        status: "failed", 
        message: "Unable to update property sale certificate", 
        error: error.message 
      });
    }
  };

  static delete = async (req, res) => {
    try {
      const { id } = req.params;
      const certificate = await PropertySaleCertificateModel.findById(id);

      if (!certificate) {
        return res.status(404).json({ 
          status: "failed", 
          message: "Property Sale Certificate not found" 
        });
      }

      // Check authorization
      if (req.user && certificate.createdBy && certificate.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          status: "failed", 
          message: "Unauthorized access" 
        });
      }

      // Delete associated files if they exist
      if (certificate.file_uploads) {
        const filesToDelete = [
          certificate.file_uploads.bank_rep_photo,
          certificate.file_uploads.prop_photo,
          ...(certificate.file_uploads.purchaser_photos || []),
          ...(certificate.file_uploads.witness_photos || [])
        ].filter(Boolean);

        filesToDelete.forEach(filePath => {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (err) {
            console.error("Error deleting file:", err);
          }
        });
      }

      await PropertySaleCertificateModel.deleteOne({ _id: id });

      return res.status(200).json({ 
        status: "success", 
        message: "Property Sale Certificate deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting Property Sale Certificate:", error);
      return res.status(500).json({ 
        status: "failed", 
        message: "Unable to delete property sale certificate", 
        error: error.message 
      });
    }
  };

  static getStats = async (req, res) => {
    try {
      const totalCertificates = await PropertySaleCertificateModel.countDocuments();
      
      // Certificates by property category
      const certificatesByCategory = await PropertySaleCertificateModel.aggregate([
        {
          $group: {
            _id: "$prop_category",
            count: { $sum: 1 }
          }
        }
      ]);

      // Certificates by month
      const certificatesByMonth = await PropertySaleCertificateModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$created_at" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // Total property cost
      const totalPropertyCost = await PropertySaleCertificateModel.aggregate([
        {
          $group: {
            _id: null,
            totalValue: { $sum: "$total_property_cost" },
            averageValue: { $avg: "$total_property_cost" }
          }
        }
      ]);

      // Total stamp duty collected
      const totalStampDuty = await PropertySaleCertificateModel.aggregate([
        {
          $group: {
            _id: null,
            totalStampDuty: { $sum: "$stamp_duty" },
            totalRegistrationFee: { $sum: "$registration_fee" }
          }
        }
      ]);

      return res.status(200).json({
        status: "success",
        message: "Property Sale Certificate statistics retrieved successfully",
        data: {
          totalCertificates,
          certificatesByCategory,
          certificatesByMonth,
          totalPropertyCost: totalPropertyCost[0] || { totalValue: 0, averageValue: 0 },
          totalStampDuty: totalStampDuty[0] || { totalStampDuty: 0, totalRegistrationFee: 0 }
        },
      });
    } catch (error) {
      console.error("Error fetching Property Sale Certificate statistics:", error);
      return res.status(500).json({ 
        status: "failed", 
        message: "Unable to retrieve property sale certificate statistics", 
        error: error.message 
      });
    }
  };

  static downloadFile = async (req, res) => {
    try {
      const { id } = req.params;
      const { fileType } = req.query; // bank_rep_photo, prop_photo, purchaser_photo, witness_photo
      
      const certificate = await PropertySaleCertificateModel.findById(id);

      if (!certificate) {
        return res.status(404).json({ 
          status: "failed", 
          message: "Property Sale Certificate not found" 
        });
      }

      // Check authorization
      if (req.user && certificate.createdBy && certificate.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ 
          status: "failed", 
          message: "Unauthorized access" 
        });
      }

      let filePath = null;
      let filename = null;

      if (!certificate.file_uploads) {
        return res.status(404).json({ 
          status: "failed", 
          message: "No files found for this certificate" 
        });
      }

      switch (fileType) {
        case 'bank_rep_photo':
          filePath = certificate.file_uploads.bank_rep_photo;
          filename = 'bank_rep_photo.jpg';
          break;
        case 'prop_photo':
          filePath = certificate.file_uploads.prop_photo;
          filename = 'prop_photo.jpg';
          break;
        default:
          return res.status(400).json({ 
            status: "failed", 
            message: "Invalid file type specified" 
          });
      }

      if (!filePath) {
        return res.status(404).json({ 
          status: "failed", 
          message: "File not found for this certificate" 
        });
      }
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          status: "failed", 
          message: "File not found on server" 
        });
      }

      // Get file stats
      const stats = fs.statSync(filePath);

      // Set appropriate headers
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', stats.size);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

    } catch (error) {
      console.error("Error downloading file:", error);
      return res.status(500).json({ 
        status: "failed", 
        message: "Unable to download file", 
        error: error.message 
      });
    }
  };
}

export default PropertySaleCertificateController;