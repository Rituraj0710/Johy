// import PropertyRegistrationModel from "../models/PropertyRegistration.js";
// import { body, validationResult } from 'express-validator';

// class PropertyRegistrationController {
//   static create = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ 
//         status: "failed", 
//         message: "Validation failed", 
//         errors: errors.array() 
//       });
//     }

//     try {
//       const {
//         seller_name,
//         seller_father_name,
//         seller_address,
//         seller_aadhaar,
//         seller_mobile,
//         buyer_name,
//         buyer_father_name,
//         buyer_address,
//         buyer_aadhaar,
//         buyer_mobile,
//         property_address,
//         property_type,
//         area_sqm,
//         sale_price,
//         registration_date
//       } = req.body;

//       // Check if the same property is already registered
//       const existingRegistration = await PropertyRegistrationModel.findOne({
//         seller_aadhaar,
//         buyer_aadhaar,
//         property_address,
//         registration_date: new Date(registration_date)
//       });

//       if (existingRegistration) {
//         return res.status(409).json({
//           status: "failed",
//           message: "This property registration already exists for the same parties and date."
//         });
//       }

//       const createdBy = req.user?._id || null;

//       const propertyRegistration = await PropertyRegistrationModel.create({
//         seller_name,
//         seller_father_name,
//         seller_address,
//         seller_aadhaar,
//         seller_mobile,
//         buyer_name,
//         buyer_father_name,
//         buyer_address,
//         buyer_aadhaar,
//         buyer_mobile,
//         property_address,
//         property_type,
//         area_sqm,
//         sale_price,
//         registration_date: new Date(registration_date),
//         createdBy,
//         status: 'pending'
//       });

//       return res.status(201).json({
//         status: "success",
//         message: "Property registration created successfully",
//         data: {
//           id: propertyRegistration._id,
//           registration_number: `PR${propertyRegistration._id.toString().slice(-8).toUpperCase()}`,
//           status: propertyRegistration.status,
//           created_at: propertyRegistration.created_at
//         }
//       });

//     } catch (error) {
//       console.error("Error creating property registration:", error);

//       // Handle specific MongoDB errors
//       if (error.code === 11000) {
//         return res.status(409).json({
//           status: "failed",
//           message: "A registration with this information already exists"
//         });
//       }

//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to create property registration",
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//       });
//     }
//   };

//   static getAll = async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const skip = (page - 1) * limit;

//       // Build query based on user role and permissions
//       const query = {};
//       if (req.user) {
//         // If user is authenticated, show only their registrations
//         query.createdBy = req.user._id;
//       }

//       // Add search functionality
//       if (req.query.search) {
//         const searchRegex = new RegExp(req.query.search, 'i');
//         query.$or = [
//           { seller_name: searchRegex },
//           { buyer_name: searchRegex },
//           { property_address: searchRegex },
//           { seller_aadhaar: searchRegex },
//           { buyer_aadhaar: searchRegex }
//         ];
//       }

//       // Add status filter
//       if (req.query.status) {
//         query.status = req.query.status;
//       }

//       const propertyRegistrations = await PropertyRegistrationModel.find(query)
//         .skip(skip)
//         .limit(limit)
//         .sort({ created_at: -1 })
//         .select('-__v');

//       const total = await PropertyRegistrationModel.countDocuments(query);

//       return res.status(200).json({
//         status: "success",
//         message: "Property registrations retrieved successfully",
//         data: propertyRegistrations,
//         meta: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit)
//         }
//       });

//     } catch (error) {
//       console.error("Error fetching property registrations:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to retrieve property registrations",
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//       });
//     }
//   };

//   static getById = async (req, res) => {
//     try {
//       const { id } = req.params;

//       const propertyRegistration = await PropertyRegistrationModel.findById(id).select('-__v');

//       if (!propertyRegistration) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Property registration not found"
//         });
//       }

//       // Check if user has permission to view this registration
//       if (req.user && propertyRegistration.createdBy && 
//           propertyRegistration.createdBy.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Unauthorized access to this property registration"
//         });
//       }

//       return res.status(200).json({
//         status: "success",
//         message: "Property registration retrieved successfully",
//         data: propertyRegistration
//       });

//     } catch (error) {
//       console.error("Error fetching property registration by ID:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to retrieve property registration",
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//       });
//     }
//   };

//   static update = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const errors = validationResult(req);

//       if (!errors.isEmpty()) {
//         return res.status(400).json({
//           status: "failed",
//           message: "Validation failed",
//           errors: errors.array()
//         });
//       }

//       const propertyRegistration = await PropertyRegistrationModel.findById(id);

//       if (!propertyRegistration) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Property registration not found"
//         });
//       }

//       // Check if user has permission to update this registration
//       if (req.user && propertyRegistration.createdBy && 
//           propertyRegistration.createdBy.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Unauthorized access to update this property registration"
//         });
//       }

//       // Prevent updating if status is approved
//       if (propertyRegistration.status === 'approved') {
//         return res.status(400).json({
//           status: "failed",
//           message: "Cannot update approved property registration"
//         });
//       }

//       const updatedData = { ...req.body };
//       if (updatedData.registration_date) {
//         updatedData.registration_date = new Date(updatedData.registration_date);
//       }

//       const updatedPropertyRegistration = await PropertyRegistrationModel.findByIdAndUpdate(
//         id,
//         updatedData,
//         { new: true, runValidators: true }
//       ).select('-__v');

//       return res.status(200).json({
//         status: "success",
//         message: "Property registration updated successfully",
//         data: updatedPropertyRegistration
//       });

//     } catch (error) {
//       console.error("Error updating property registration:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to update property registration",
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//       });
//     }
//   };

//   static delete = async (req, res) => {
//     try {
//       const { id } = req.params;

//       const propertyRegistration = await PropertyRegistrationModel.findById(id);

//       if (!propertyRegistration) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Property registration not found"
//         });
//       }

//       // Check if user has permission to delete this registration
//       if (req.user && propertyRegistration.createdBy && 
//           propertyRegistration.createdBy.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Unauthorized access to delete this property registration"
//         });
//       }

//       // Prevent deleting if status is approved
//       if (propertyRegistration.status === 'approved') {
//         return res.status(400).json({
//           status: "failed",
//           message: "Cannot delete approved property registration"
//         });
//       }

//       await PropertyRegistrationModel.findByIdAndDelete(id);

//       return res.status(200).json({
//         status: "success",
//         message: "Property registration deleted successfully"
//       });

//     } catch (error) {
//       console.error("Error deleting property registration:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to delete property registration",
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//       });
//     }
//   };

//   static getStats = async (req, res) => {
//     try {
//       const query = {};
//       if (req.user) {
//         query.createdBy = req.user._id;
//       }

//       const totalRegistrations = await PropertyRegistrationModel.countDocuments(query);

//       const registrationsByStatus = await PropertyRegistrationModel.aggregate([
//         { $match: query },
//         {
//           $group: {
//             _id: '$status',
//             count: { $sum: 1 }
//           }
//         }
//       ]);

//       const registrationsByMonth = await PropertyRegistrationModel.aggregate([
//         { $match: query },
//         {
//           $group: {
//             _id: { $dateToString: { format: "%Y-%m", date: "$created_at" } },
//             count: { $sum: 1 }
//           }
//         },
//         { $sort: { _id: 1 } }
//       ]);

//       const registrationsByPropertyType = await PropertyRegistrationModel.aggregate([
//         { $match: query },
//         {
//           $group: {
//             _id: '$property_type',
//             count: { $sum: 1 }
//           }
//         }
//       ]);

//       return res.status(200).json({
//         status: "success",
//         message: "Property registration statistics retrieved successfully",
//         data: {
//           totalRegistrations,
//           registrationsByStatus,
//           registrationsByMonth,
//           registrationsByPropertyType
//         }
//       });

//     } catch (error) {
//       console.error("Error fetching property registration statistics:", error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to retrieve property registration statistics",
//         error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
//       });
//     }
//   };
// }

// export default PropertyRegistrationController;

import PropertyRegistration from '../models/PropertyRegistration.js';

// Create a new property registration
export const createPropertyRegistration = async (req, res) => {
  try {
    const propertyRegistration = new PropertyRegistration(req.body);
    await propertyRegistration.save();
    res.status(201).json({ message: 'संपत्ति पंजीकरण सफलतापूर्वक जमा हो गया!', data: propertyRegistration });
  } catch (error) {
    console.error('Error creating property registration:', error);
    res.status(400).json({ message: 'सबमिशन में त्रुटि हुई', error: error.message });
  }
};

// Get all property registrations
export const getAllPropertyRegistrations = async (req, res) => {
  try {
    const propertyRegistrations = await PropertyRegistration.find().sort({ createdAt: -1 });
    res.status(200).json({ message: 'सभी पंजीकरण प्राप्त हुए', data: propertyRegistrations });
  } catch (error) {
    console.error('Error fetching property registrations:', error);
    res.status(500).json({ message: 'पंजीकरण प्राप्त करने में त्रुटि', error: error.message });
  }
};

// Get a single property registration by ID
export const getPropertyRegistrationById = async (req, res) => {
  try {
    const propertyRegistration = await PropertyRegistration.findById(req.params.id);
    if (!propertyRegistration) {
      return res.status(404).json({ message: 'प्रमाण पत्र नहीं मिला' });
    }
    res.status(200).json({ message: 'प्रमाण पत्र प्राप्त हुआ', data: propertyRegistration });
  } catch (error) {
    console.error('Error fetching property registration:', error);
    res.status(500).json({ message: 'प्रमाण पत्र प्राप्त करने में त्रुटि', error: error.message });
  }
};