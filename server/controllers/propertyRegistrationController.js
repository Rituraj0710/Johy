import PropertyRegistration from "../models/PropertyRegistration.js";
import logger from "../config/logger.js";
import DOMPurify from 'isomorphic-dompurify';

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

class PropertyRegistrationController {
  static create = async (req, res) => {
    try {
      const sanitizedData = sanitizeInput(req.body);
      
      const {
        seller_name, seller_father_name, seller_address, seller_aadhaar, seller_mobile,
        buyer_name, buyer_father_name, buyer_address, buyer_aadhaar, buyer_mobile,
        property_address, property_type, area_sqm, sale_price, registration_date
      } = sanitizedData;

      if (!seller_name || !buyer_name || !property_address || !property_type) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required fields"
        });
      }

      const propertyRegistrationData = {
        seller: { name: seller_name, father_name: seller_father_name, address: seller_address, aadhaar: seller_aadhaar, mobile: seller_mobile },
        buyer: { name: buyer_name, father_name: buyer_father_name, address: buyer_address, aadhaar: buyer_aadhaar, mobile: buyer_mobile },
        property: { address: property_address, type: property_type, area_sqm: parseFloat(area_sqm), sale_price: parseFloat(sale_price), registration_date: new Date(registration_date) },
        createdBy: req.user?.id,
        status: 'draft',
        amount: 1200
      };

      const propertyRegistration = new PropertyRegistration(propertyRegistrationData);
      await propertyRegistration.save();

      res.status(201).json({
        status: "success",
        message: "Property registration created successfully",
        data: { id: propertyRegistration._id, status: propertyRegistration.status, amount: propertyRegistration.amount }
      });

    } catch (error) {
      logger.error('Property registration creation error', { error: error.message, userId: req.user?.id });
      res.status(500).json({ status: "failed", message: "Internal server error" });
    }
  };

  static getAll = async (req, res) => {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const filter = status ? { status } : {};
      
      const propertyRegistrations = await PropertyRegistration.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await PropertyRegistration.countDocuments(filter);

      res.status(200).json({
        status: "success",
        data: { propertyRegistrations, totalPages: Math.ceil(total / limit), currentPage: page, total }
      });

    } catch (error) {
      logger.error('Get all property registrations error', { error: error.message });
      res.status(500).json({ status: "failed", message: "Internal server error" });
    }
  };

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      const propertyRegistration = await PropertyRegistration.findById(id).populate('createdBy', 'name email');

      if (!propertyRegistration) {
        return res.status(404).json({ status: "failed", message: "Property registration not found" });
      }

      res.status(200).json({ status: "success", data: { propertyRegistration } });

    } catch (error) {
      logger.error('Get property registration by ID error', { error: error.message });
      res.status(500).json({ status: "failed", message: "Internal server error" });
    }
  };

  static updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['draft', 'submitted', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ status: "failed", message: "Invalid status" });
      }

      const propertyRegistration = await PropertyRegistration.findByIdAndUpdate(id, { status }, { new: true });

      if (!propertyRegistration) {
        return res.status(404).json({ status: "failed", message: "Property registration not found" });
      }

      res.status(200).json({ status: "success", message: "Status updated successfully", data: { propertyRegistration } });

    } catch (error) {
      logger.error('Update property registration status error', { error: error.message });
      res.status(500).json({ status: "failed", message: "Internal server error" });
    }
  };

  static delete = async (req, res) => {
    try {
      const { id } = req.params;
      const propertyRegistration = await PropertyRegistration.findByIdAndDelete(id);

      if (!propertyRegistration) {
        return res.status(404).json({ status: "failed", message: "Property registration not found" });
      }

      res.status(200).json({ status: "success", message: "Property registration deleted successfully" });

    } catch (error) {
      logger.error('Delete property registration error', { error: error.message });
      res.status(500).json({ status: "failed", message: "Internal server error" });
    }
  };

  static getStats = async (req, res) => {
    try {
      const stats = await PropertyRegistration.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

      const formattedStats = { total: 0, draft: 0, submitted: 0, approved: 0, rejected: 0 };
      stats.forEach(stat => { formattedStats[stat._id] = stat.count; formattedStats.total += stat.count; });

      res.status(200).json({ status: "success", data: { stats: formattedStats } });

    } catch (error) {
      logger.error('Get property registration stats error', { error: error.message });
      res.status(500).json({ status: "failed", message: "Internal server error" });
    }
  };
}

export default PropertyRegistrationController;
