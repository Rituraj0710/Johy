import SaleDeed from "../models/SaleDeed.js";
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

class SaleDeedController {
  static create = async (req, res) => {
    try {
      // Sanitize all input data
      const sanitizedData = sanitizeInput(req.body);
      
      const {
        documentType,
        propertyType,
        plotType,
        salePrice,
        circleRateAmount,
        area,
        areaUnit,
        propertyLength,
        propertyWidth,
        sellers = [],
        buyers = [],
        witnesses = [],
        rooms = [],
        trees = [],
        shops = [],
        mallFloors = [],
        facilities = [],
        dynamicFacilities = [],
        calculations = {}
      } = sanitizedData;

      // Validation
      if (!documentType || !propertyType || !salePrice || !circleRateAmount) {
        logger.warn('Sale deed creation failed: Missing required fields', { 
          userId: req.user?.id,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
        return res.status(400).json({
          status: "failed",
          message: "Missing required fields: documentType, propertyType, salePrice, circleRateAmount"
        });
      }

      // Validate sellers
      if (!sellers || sellers.length === 0) {
        logger.warn('Sale deed creation failed: No sellers provided', { 
          userId: req.user?.id,
          ip: req.ip
        });
        return res.status(400).json({
          status: "failed",
          message: "At least one seller is required"
        });
      }

      // Validate buyers
      if (!buyers || buyers.length === 0) {
        logger.warn('Sale deed creation failed: No buyers provided', { 
          userId: req.user?.id,
          ip: req.ip
        });
        return res.status(400).json({
          status: "failed",
          message: "At least one buyer is required"
        });
      }

      // Create sale deed
      const saleDeedData = {
        documentType,
        propertyType,
        plotType,
        salePrice: parseFloat(salePrice),
        circleRateAmount: parseFloat(circleRateAmount),
        area: parseFloat(area) || 0,
        areaUnit,
        propertyLength: parseFloat(propertyLength) || 0,
        propertyWidth: parseFloat(propertyWidth) || 0,
        sellers,
        buyers,
        witnesses,
        rooms,
        trees,
        shops,
        mallFloors,
        facilities,
        dynamicFacilities,
        calculations,
        createdBy: req.user?.id,
        status: 'draft',
        amount: 1500 // Base amount for sale deed
      };

      const saleDeed = new SaleDeed(saleDeedData);
      await saleDeed.save();

      logger.info('Sale deed created successfully', { 
        saleDeedId: saleDeed._id,
        userId: req.user?.id,
        documentType,
        propertyType
      });

      res.status(201).json({
        status: "success",
        message: "Sale deed created successfully",
        data: {
          id: saleDeed._id,
          documentType: saleDeed.documentType,
          propertyType: saleDeed.propertyType,
          status: saleDeed.status,
          amount: saleDeed.amount
        }
      });

    } catch (error) {
      logger.error('Sale deed creation error', { 
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
      
      const saleDeeds = await SaleDeed.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await SaleDeed.countDocuments(filter);

      res.status(200).json({
        status: "success",
        data: {
          saleDeeds,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total
        }
      });

    } catch (error) {
      logger.error('Get all sale deeds error', { 
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
      
      const saleDeed = await SaleDeed.findById(id)
        .populate('createdBy', 'name email');

      if (!saleDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Sale deed not found"
        });
      }

      res.status(200).json({
        status: "success",
        data: { saleDeed }
      });

    } catch (error) {
      logger.error('Get sale deed by ID error', { 
        error: error.message,
        saleDeedId: req.params.id,
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

      const saleDeed = await SaleDeed.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!saleDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Sale deed not found"
        });
      }

      logger.info('Sale deed status updated', { 
        saleDeedId: id,
        newStatus: status,
        userId: req.user?.id
      });

      res.status(200).json({
        status: "success",
        message: "Sale deed status updated successfully",
        data: { saleDeed }
      });

    } catch (error) {
      logger.error('Update sale deed status error', { 
        error: error.message,
        saleDeedId: req.params.id,
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
      
      const saleDeed = await SaleDeed.findByIdAndDelete(id);

      if (!saleDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Sale deed not found"
        });
      }

      logger.info('Sale deed deleted', { 
        saleDeedId: id,
        userId: req.user?.id
      });

      res.status(200).json({
        status: "success",
        message: "Sale deed deleted successfully"
      });

    } catch (error) {
      logger.error('Delete sale deed error', { 
        error: error.message,
        saleDeedId: req.params.id,
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
      const stats = await SaleDeed.aggregate([
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
      logger.error('Get sale deed stats error', { 
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

export default SaleDeedController;
