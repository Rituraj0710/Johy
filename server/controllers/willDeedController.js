import WillDeed from "../models/WillDeed.js";
import logger from "../config/logger.js";
import DOMPurify from 'isomorphic-dompurify';

// Input sanitization function
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim());
  }
  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return input;
};

class WillDeedController {
  static submit = async (req, res) => {
    try {
      const jsonPart = req.body?.data ? JSON.parse(req.body.data) : null;
      if (!jsonPart) {
        return res.status(400).json({ status: 'failed', message: 'Missing form data' });
      }

      const sanitizedData = sanitizeInput(jsonPart);

      const willDeedData = {
        meta: sanitizedData.meta || {},
        testator: sanitizedData.testator || {},
        beneficiaries: sanitizedData.beneficiaries || [],
        executors: sanitizedData.executors || [],
        witnesses: sanitizedData.witnesses || [],
        immovables: sanitizedData.immovables || [],
        movables: sanitizedData.movables || [],
        rules: sanitizedData.rules || [],
        conditions: sanitizedData.conditions || [],
        createdBy: req.user?._id
      };

      const uploads = { testatorId: '', testatorPhoto: '', personIds: [], personPhotos: [] };
      (req.files || []).forEach((f) => {
        if (f.fieldname === 'testator_id') uploads.testatorId = f.path;
        else if (f.fieldname === 'testator_photo') uploads.testatorPhoto = f.path;
        else if (f.fieldname.startsWith('person_id_')) uploads.personIds.push(f.path);
        else if (f.fieldname.startsWith('person_photo_')) uploads.personPhotos.push(f.path);
      });
      willDeedData.uploads = uploads;

      const willDeed = new WillDeed(willDeedData);
      await willDeed.save();

      return res.status(201).json({ status: 'success', message: 'Will Deed submitted', data: { id: willDeed._id } });
    } catch (error) {
      logger.error('Will deed submit error', { error: error.message, stack: error.stack, userId: req.user?._id });
      return res.status(500).json({ status: 'failed', message: 'Internal server error' });
    }
  }
  static create = async (req, res) => {
    try {
      // Sanitize all input data
      const sanitizedData = sanitizeInput(req.body);
      
      const {
        testator_name,
        testator_father_name,
        testator_address,
        testator_mobile,
        testator_email,
        testator_aadhaar,
        testator_occupation,
        testator_marital_status,
        testator_spouse_name,
        testator_children = [],
        testator_assets = [],
        testator_beneficiaries = [],
        testator_executors = [],
        testator_witnesses = [],
        will_date,
        will_place,
        will_type,
        will_purpose,
        will_conditions = [],
        will_special_instructions
      } = sanitizedData;

      // Validation
      if (!testator_name || !testator_father_name || !testator_address || !testator_mobile || !testator_aadhaar) {
        logger.warn('Will deed creation failed: Missing required fields', { 
          userId: req.user?.id,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
        return res.status(400).json({
          status: "failed",
          message: "Missing required fields: testator_name, testator_father_name, testator_address, testator_mobile, testator_aadhaar"
        });
      }

      // Validate Aadhaar number (12 digits)
      const aadhaarRegex = /^[0-9]{12}$/;
      if (!aadhaarRegex.test(testator_aadhaar)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid Aadhaar number. Must be 12 digits."
        });
      }

      // Validate mobile number (10 digits)
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(testator_mobile)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid mobile number. Must be 10 digits."
        });
      }

      // Validate beneficiaries
      if (!testator_beneficiaries || testator_beneficiaries.length === 0) {
        logger.warn('Will deed creation failed: No beneficiaries provided', { 
          userId: req.user?.id,
          ip: req.ip
        });
        return res.status(400).json({
          status: "failed",
          message: "At least one beneficiary is required"
        });
      }

      // Validate each beneficiary
      for (const beneficiary of testator_beneficiaries) {
        if (!beneficiary.name || !beneficiary.relationship || !beneficiary.share) {
          logger.warn('Will deed creation failed: Invalid beneficiary data', { 
            userId: req.user?.id,
            beneficiary: beneficiary
          });
          return res.status(400).json({
            status: "failed",
            message: "Each beneficiary must have name, relationship, and share"
          });
        }
      }

      // Create will deed
      const willDeedData = {
        testator: {
          name: testator_name,
          father_name: testator_father_name,
          address: testator_address,
          mobile: testator_mobile,
          email: testator_email,
          aadhaar: testator_aadhaar,
          occupation: testator_occupation,
          marital_status: testator_marital_status,
          spouse_name: testator_spouse_name
        },
        children: testator_children,
        assets: testator_assets,
        beneficiaries: testator_beneficiaries,
        executors: testator_executors,
        witnesses: testator_witnesses,
        will_details: {
          date: new Date(will_date),
          place: will_place,
          type: will_type,
          purpose: will_purpose,
          conditions: will_conditions,
          special_instructions: will_special_instructions
        },
        createdBy: req.user?.id,
        status: 'draft',
        amount: 1800 // Base amount for will deed
      };

      const willDeed = new WillDeed(willDeedData);
      await willDeed.save();

      logger.info('Will deed created successfully', { 
        willDeedId: willDeed._id,
        userId: req.user?.id,
        testator_name
      });

      res.status(201).json({
        status: "success",
        message: "Will deed created successfully",
        data: {
          id: willDeed._id,
          testator_name: willDeed.testator.name,
          status: willDeed.status,
          amount: willDeed.amount
        }
      });

    } catch (error) {
      logger.error('Will deed creation error', { 
        error: error.message,
        stack: error.stack,
        userId: req.user?.id,
        ip: req.ip
      });
      
      res.status(500).json({
        status: "failed",
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    }
  };

  static getAll = async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const filter = { createdBy: req.user?._id };
      if (status) filter.status = status;
      
      const willDeeds = await WillDeed.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await WillDeed.countDocuments(filter);

      res.status(200).json({
        status: "success",
        data: {
          willDeeds,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total
        }
      });

    } catch (error) {
      logger.error('Get all will deeds error', { 
        error: error.message,
        userId: req.user?.id
      });
      
      res.status(500).json({
        status: "failed",
        message: "Internal server error"
      });
    }
  };

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      
      const willDeed = await WillDeed.findOne({ _id: id, createdBy: req.user?._id })
        .populate('createdBy', 'name email');

      if (!willDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Will deed not found"
        });
      }

      res.status(200).json({
        status: "success",
        data: { willDeed }
      });

    } catch (error) {
      logger.error('Get will deed by ID error', { 
        error: error.message,
        willDeedId: req.params.id,
        userId: req.user?.id
      });
      
      res.status(500).json({
        status: "failed",
        message: "Internal server error"
      });
    }
  };

  static updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['draft', 'submitted', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid status. Must be one of: draft, submitted, approved, rejected"
        });
      }

      const willDeed = await WillDeed.findOneAndUpdate(
        { _id: id, createdBy: req.user?._id },
        { status },
        { new: true }
      );

      if (!willDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Will deed not found"
        });
      }

      logger.info('Will deed status updated', { 
        willDeedId: id,
        newStatus: status,
        userId: req.user?.id
      });

      res.status(200).json({
        status: "success",
        message: "Will deed status updated successfully",
        data: { willDeed }
      });

    } catch (error) {
      logger.error('Update will deed status error', { 
        error: error.message,
        willDeedId: req.params.id,
        userId: req.user?.id
      });
      
      res.status(500).json({
        status: "failed",
        message: "Internal server error"
      });
    }
  };

  static delete = async (req, res) => {
    try {
      const { id } = req.params;
      
      const willDeed = await WillDeed.findOneAndDelete({ _id: id, createdBy: req.user?._id });

      if (!willDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Will deed not found"
        });
      }

      logger.info('Will deed deleted', { 
        willDeedId: id,
        userId: req.user?.id
      });

      res.status(200).json({
        status: "success",
        message: "Will deed deleted successfully"
      });

    } catch (error) {
      logger.error('Delete will deed error', { 
        error: error.message,
        willDeedId: req.params.id,
        userId: req.user?.id
      });
      
      res.status(500).json({
        status: "failed",
        message: "Internal server error"
      });
    }
  };

  static getStats = async (req, res) => {
    try {
      const stats = await WillDeed.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const formattedStats = {
        total: 0,
        draft: 0,
        submitted: 0,
        approved: 0,
        rejected: 0
      };

      stats.forEach(stat => {
        formattedStats[stat._id] = stat.count;
        formattedStats.total += stat.count;
      });

      res.status(200).json({
        status: "success",
        data: { stats: formattedStats }
      });

    } catch (error) {
      logger.error('Get will deed stats error', { 
        error: error.message,
        userId: req.user?.id
      });
      
      res.status(500).json({
        status: "failed",
        message: "Internal server error"
      });
    }
  };
}

export default WillDeedController;
