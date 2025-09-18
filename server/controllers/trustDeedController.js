import TrustDeed from "../models/TrustDeed.js";
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

class TrustDeedController {
  static create = async (req, res) => {
    try {
      // Sanitize all input data
      const sanitizedData = sanitizeInput(req.body);
      
      const {
        trustName,
        trustAddress,
        startingAmount_number,
        startingAmount_words,
        trustees = [],
        functionalDomains = [],
        purposes = [],
        otherPurposes = [],
        terms = [],
        otherTerms = [],
        witnesses = []
      } = sanitizedData;

      // Validation
      if (!trustName || !trustAddress || !startingAmount_number || !startingAmount_words) {
        logger.warn('Trust deed creation failed: Missing required fields', { 
          userId: req.user?.id,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
        return res.status(400).json({
          status: "failed",
          message: "Missing required fields: trustName, trustAddress, startingAmount_number, startingAmount_words"
        });
      }

      // Validate trustees
      if (!trustees || trustees.length === 0) {
        logger.warn('Trust deed creation failed: No trustees provided', { 
          userId: req.user?.id,
          ip: req.ip
        });
        return res.status(400).json({
          status: "failed",
          message: "At least one trustee is required"
        });
      }

      // Validate each trustee
      for (const trustee of trustees) {
        if (!trustee.name || !trustee.address || !trustee.mobile) {
          logger.warn('Trust deed creation failed: Invalid trustee data', { 
            userId: req.user?.id,
            trustee: trustee
          });
          return res.status(400).json({
            status: "failed",
            message: "Each trustee must have name, address, and mobile number"
          });
        }
      }

      // Create trust deed
      const trustDeedData = {
        trustName,
        trustAddress,
        startingAmount: {
          number: startingAmount_number,
          words: startingAmount_words
        },
        trustees,
        functionalDomains,
        purposes,
        otherPurposes,
        terms,
        otherTerms,
        witnesses,
        createdBy: req.user?.id,
        status: 'draft',
        amount: 1000 // Base amount for trust deed
      };

      const trustDeed = new TrustDeed(trustDeedData);
      await trustDeed.save();

      logger.info('Trust deed created successfully', { 
        trustDeedId: trustDeed._id,
        userId: req.user?.id,
        trustName
      });

      res.status(201).json({
        status: "success",
        message: "Trust deed created successfully",
        data: {
          id: trustDeed._id,
          trustName: trustDeed.trustName,
          status: trustDeed.status,
          amount: trustDeed.amount
        }
      });

    } catch (error) {
      logger.error('Trust deed creation error', { 
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
      const filter = status ? { status } : {};
      
      const trustDeeds = await TrustDeed.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await TrustDeed.countDocuments(filter);

      res.status(200).json({
        status: "success",
        data: {
          trustDeeds,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total
        }
      });

    } catch (error) {
      logger.error('Get all trust deeds error', { 
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
      
      const trustDeed = await TrustDeed.findById(id)
        .populate('createdBy', 'name email');

      if (!trustDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Trust deed not found"
        });
      }

      res.status(200).json({
        status: "success",
        data: { trustDeed }
      });

    } catch (error) {
      logger.error('Get trust deed by ID error', { 
        error: error.message,
        trustDeedId: req.params.id,
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

      const trustDeed = await TrustDeed.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!trustDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Trust deed not found"
        });
      }

      logger.info('Trust deed status updated', { 
        trustDeedId: id,
        newStatus: status,
        userId: req.user?.id
      });

      res.status(200).json({
        status: "success",
        message: "Trust deed status updated successfully",
        data: { trustDeed }
      });

    } catch (error) {
      logger.error('Update trust deed status error', { 
        error: error.message,
        trustDeedId: req.params.id,
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
      
      const trustDeed = await TrustDeed.findByIdAndDelete(id);

      if (!trustDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Trust deed not found"
        });
      }

      logger.info('Trust deed deleted', { 
        trustDeedId: id,
        userId: req.user?.id
      });

      res.status(200).json({
        status: "success",
        message: "Trust deed deleted successfully"
      });

    } catch (error) {
      logger.error('Delete trust deed error', { 
        error: error.message,
        trustDeedId: req.params.id,
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
      const stats = await TrustDeed.aggregate([
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
      logger.error('Get trust deed stats error', { 
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

export const createTrustDeed = TrustDeedController.create;
export const getAllTrustDeeds = TrustDeedController.getAll;
export const getTrustDeedById = TrustDeedController.getById;
export const updateTrustDeedStatus = TrustDeedController.updateStatus;
export const deleteTrustDeed = TrustDeedController.delete;
export const getTrustDeedStats = TrustDeedController.getStats;
export default TrustDeedController;
