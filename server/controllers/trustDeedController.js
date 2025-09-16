// import TrustDeedModel from "../models/TrustDeed.js";

// class TrustDeedController {
//   static create = async (req, res) => {
//     try {
//       // Parse form data from request body
//       const {
//         trustName,
//         trustAddress,
//         startingAmount_number,
//         startingAmount_words,
//         // Trustees data
//         trusteeSalutation_1,
//         trusteePosition_1,
//         trusteeName_1,
//         trusteeRelation_1,
//         trusteeAddress_1,
//         trusteeMobile_1,
//         trusteeIdType_1,
//         trusteeIdNumber_1,
//         // Functional domains
//         functionalDomain_1,
//         // Purposes
//         purpose,
//         otherPurpose_1,
//         // Terms
//         terms,
//         otherTerm_1,
//         // Witnesses
//         witnessName_1,
//         witnessRelation_1,
//         witnessAddress_1,
//         witnessMobile_1,
//         witnessIdType_1,
//         witnessIdNumber_1,
//         witnessName_2,
//         witnessRelation_2,
//         witnessAddress_2,
//         witnessMobile_2,
//         witnessIdType_2,
//         witnessIdNumber_2,
//         ...otherFields
//       } = req.body;

//       // Validation
//       if (!trustName || !trustAddress || !startingAmount_number || !startingAmount_words) {
//         return res.status(400).json({
//           status: "failed",
//           message: "Missing required fields: trustName, trustAddress, startingAmount_number, startingAmount_words"
//         });
//       }

//       // Process trustees data
//       const trustees = [];
//       let trusteeIndex = 1;

//       while (req.body[`trusteeName_${trusteeIndex}`]) {
//         const trustee = {
//           salutation: req.body[`trusteeSalutation_${trusteeIndex}`] || 'श्री',
//           position: req.body[`trusteePosition_${trusteeIndex}`],
//           name: req.body[`trusteeName_${trusteeIndex}`],
//           relation: req.body[`trusteeRelation_${trusteeIndex}`],
//           address: req.body[`trusteeAddress_${trusteeIndex}`],
//           mobile: req.body[`trusteeMobile_${trusteeIndex}`],
//           idType: req.body[`trusteeIdType_${trusteeIndex}`] || 'आधार कार्ड',
//           idNumber: req.body[`trusteeIdNumber_${trusteeIndex}`],
//           idCardFile: null,
//           photoFile: null
//         };

//         // Validate required trustee fields
//         if (!trustee.position || !trustee.name || !trustee.relation || !trustee.address || !trustee.mobile || !trustee.idNumber) {
//           return res.status(400).json({
//             status: "failed",
//             message: `Missing required trustee fields for trustee ${trusteeIndex}`
//           });
//         }

//         trustees.push(trustee);
//         trusteeIndex++;
//       }

//       // Process functional domains
//       const functionalDomains = [];
//       let domainIndex = 1;
//       while (req.body[`functionalDomain_${domainIndex}`]) {
//         functionalDomains.push(req.body[`functionalDomain_${domainIndex}`]);
//         domainIndex++;
//       }

//       // Process purposes
//       const purposes = Array.isArray(purpose) ? purpose : (purpose ? [purpose] : []);
//       const otherPurposes = [];
//       let purposeIndex = 1;
//       while (req.body[`otherPurpose_${purposeIndex}`]) {
//         otherPurposes.push(req.body[`otherPurpose_${purposeIndex}`]);
//         purposeIndex++;
//       }

//       // Process terms
//       const termsArray = Array.isArray(terms) ? terms : (terms ? [terms] : []);
//       const otherTerms = [];
//       let termIndex = 1;
//       while (req.body[`otherTerm_${termIndex}`]) {
//         otherTerms.push(req.body[`otherTerm_${termIndex}`]);
//         termIndex++;
//       }

//       // Process witnesses
//       const witnesses = [];

//       // Witness 1
//       if (witnessName_1) {
//         witnesses.push({
//           name: witnessName_1,
//           relation: witnessRelation_1 || '',
//           address: witnessAddress_1 || '',
//           mobile: witnessMobile_1 || '',
//           idType: witnessIdType_1 || 'आधार कार्ड',
//           idNumber: witnessIdNumber_1 || '',
//           idCardFile: null,
//           photoFile: null
//         });
//       }

//       // Witness 2
//       if (witnessName_2) {
//         witnesses.push({
//           name: witnessName_2,
//           relation: witnessRelation_2 || '',
//           address: witnessAddress_2 || '',
//           mobile: witnessMobile_2 || '',
//           idType: witnessIdType_2 || 'आधार कार्ड',
//           idNumber: witnessIdNumber_2 || '',
//           idCardFile: null,
//           photoFile: null
//         });
//       }

//       // Process file uploads
//       const files = (req.files || []).map(f => ({
//         field: f.fieldname,
//         path: f.path.replace(/\\/g, '/'),
//         originalName: f.originalname,
//         mimeType: f.mimetype,
//         size: f.size,
//       }));

//       // Map file uploads to trustees and witnesses
//       files.forEach(file => {
//         const fieldName = file.field;

//         // Trustee files
//         if (fieldName.includes('trusteeIdCard_')) {
//           const trusteeIndex = parseInt(fieldName.split('_')[2]) - 1;
//           if (trustees[trusteeIndex]) {
//             trustees[trusteeIndex].idCardFile = file.path;
//           }
//         } else if (fieldName.includes('trusteePhoto_')) {
//           const trusteeIndex = parseInt(fieldName.split('_')[2]) - 1;
//           if (trustees[trusteeIndex]) {
//             trustees[trusteeIndex].photoFile = file.path;
//           }
//         }

//         // Witness files
//         if (fieldName.includes('witnessIdCard_')) {
//           const witnessIndex = parseInt(fieldName.split('_')[2]) - 1;
//           if (witnesses[witnessIndex]) {
//             witnesses[witnessIndex].idCardFile = file.path;
//           }
//         } else if (fieldName.includes('witnessPhoto_')) {
//           const witnessIndex = parseInt(fieldName.split('_')[2]) - 1;
//           if (witnesses[witnessIndex]) {
//             witnesses[witnessIndex].photoFile = file.path;
//           }
//         }
//       });

//       const createdBy = req.user?._id || null;

//       // Create trust deed document
//       const trustDeed = await TrustDeedModel.create({
//         trustName,
//         trustAddress,
//         startingAmount: {
//           number: startingAmount_number,
//           words: startingAmount_words
//         },
//         trustees,
//         functionalDomains,
//         purposes,
//         otherPurposes,
//         terms: termsArray,
//         otherTerms,
//         witnesses,
//         files,
//         createdBy,
//       });

//       return res.status(201).json({
//         status: "success",
//         message: "Trust Deed created successfully",
//         data: {
//           id: trustDeed._id,
//           trustName: trustDeed.trustName,
//           created_at: trustDeed.created_at,
//           files: trustDeed.files
//         }
//       });

//     } catch (error) {
//       console.error('Trust Deed creation error:', error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to create trust deed",
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       });
//     }
//   };

//   static getAll = async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const skip = (page - 1) * limit;

//       const filter = {};
//       if (req.user?._id) {
//         filter.createdBy = req.user._id;
//       }

//       const trustDeeds = await TrustDeedModel.find(filter)
//         .sort({ created_at: -1 })
//         .skip(skip)
//         .limit(limit)
//         .select('trustName trustAddress startingAmount created_at trustees.name trustees.position');

//       const total = await TrustDeedModel.countDocuments(filter);

//       return res.status(200).json({
//         status: "success",
//         data: {
//           trustDeeds,
//           pagination: {
//             page,
//             limit,
//             total,
//             pages: Math.ceil(total / limit)
//           }
//         }
//       });

//     } catch (error) {
//       console.error('Get trust deeds error:', error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to fetch trust deeds"
//       });
//     }
//   };

//   static getById = async (req, res) => {
//     try {
//       const { id } = req.params;

//       if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//         return res.status(400).json({
//           status: "failed",
//           message: "Invalid trust deed ID"
//         });
//       }

//       const trustDeed = await TrustDeedModel.findById(id);

//       if (!trustDeed) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Trust deed not found"
//         });
//       }

//       // Check if user has access to this trust deed
//       if (req.user?._id && trustDeed.createdBy && trustDeed.createdBy.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Access denied"
//         });
//       }

//       return res.status(200).json({
//         status: "success",
//         data: trustDeed
//       });

//     } catch (error) {
//       console.error('Get trust deed error:', error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to fetch trust deed"
//       });
//     }
//   };

//   static update = async (req, res) => {
//     try {
//       const { id } = req.params;

//       if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//         return res.status(400).json({
//           status: "failed",
//           message: "Invalid trust deed ID"
//         });
//       }

//       const trustDeed = await TrustDeedModel.findById(id);

//       if (!trustDeed) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Trust deed not found"
//         });
//       }

//       // Check if user has access to update this trust deed
//       if (req.user?._id && trustDeed.createdBy && trustDeed.createdBy.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Access denied"
//         });
//       }

//       // Update logic would go here (similar to create but with findByIdAndUpdate)
//       // For now, return not implemented
//       return res.status(501).json({
//         status: "failed",
//         message: "Update functionality not yet implemented"
//       });

//     } catch (error) {
//       console.error('Update trust deed error:', error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to update trust deed"
//       });
//     }
//   };

//   static delete = async (req, res) => {
//     try {
//       const { id } = req.params;

//       if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//         return res.status(400).json({
//           status: "failed",
//           message: "Invalid trust deed ID"
//         });
//       }

//       const trustDeed = await TrustDeedModel.findById(id);

//       if (!trustDeed) {
//         return res.status(404).json({
//           status: "failed",
//           message: "Trust deed not found"
//         });
//       }

//       // Check if user has access to delete this trust deed
//       if (req.user?._id && trustDeed.createdBy && trustDeed.createdBy.toString() !== req.user._id.toString()) {
//         return res.status(403).json({
//           status: "failed",
//           message: "Access denied"
//         });
//       }

//       await TrustDeedModel.findByIdAndDelete(id);

//       return res.status(200).json({
//         status: "success",
//         message: "Trust deed deleted successfully"
//       });

//     } catch (error) {
//       console.error('Delete trust deed error:', error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to delete trust deed"
//       });
//     }
//   };

//   static getStats = async (req, res) => {
//     try {
//       const filter = {};
//       if (req.user?._id) {
//         filter.createdBy = req.user._id;
//       }

//       const totalTrustDeeds = await TrustDeedModel.countDocuments(filter);

//       const stats = await TrustDeedModel.aggregate([
//         { $match: filter },
//         {
//           $group: {
//             _id: null,
//             totalTrustDeeds: { $sum: 1 },
//             totalTrustees: { $sum: { $size: "$trustees" } },
//             avgTrusteesPerDeed: { $avg: { $size: "$trustees" } }
//           }
//         }
//       ]);

//       return res.status(200).json({
//         status: "success",
//         data: {
//           totalTrustDeeds,
//           ...(stats[0] || { totalTrustees: 0, avgTrusteesPerDeed: 0 })
//         }
//       });

//     } catch (error) {
//       console.error('Get stats error:', error);
//       return res.status(500).json({
//         status: "failed",
//         message: "Unable to fetch statistics"
//       });
//     }
//   };
// }

// export default TrustDeedController;



import TrustDeed from "../models/TrustDeed.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads", "trust-deeds");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname.includes("Photo")) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for photos"), false);
    }
  } else if (file.fieldname.includes("IdCard")) {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only image and PDF files are allowed for ID documents"), false);
    }
  } else {
    cb(new Error("Invalid field name for file upload"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Create Trust Deed
export const createTrustDeed = async (req, res) => {
  try {
    const { trustName, trustAddress, startingAmount_number, startingAmount_words } = req.body;

    // Validate required fields
    if (!trustName || !trustAddress || !startingAmount_number || !startingAmount_words) {
      return res.status(400).json({
        status: "fail",
        message: "All trust details are required",
      });
    }

    // Parse trustees
    const trustees = [];
    let i = 1;
    while (req.body[`trusteeSalutation_${i}`]) {
      const trustee = {
        salutation: req.body[`trusteeSalutation_${i}`],
        position: req.body[`trusteePosition_${i}`],
        name: req.body[`trusteeName_${i}`],
        relation: req.body[`trusteeRelation_${i}`],
        address: req.body[`trusteeAddress_${i}`],
        mobile: req.body[`trusteeMobile_${i}`],
        idType: req.body[`trusteeIdType_${i}`],
        idNumber: req.body[`trusteeIdNumber_${i}`],
        idCard: req.files && req.files[`trusteeIdCard_${i}`] ? req.files[`trusteeIdCard_${i}`][0].filename : null,
        photo: req.files && req.files[`trusteePhoto_${i}`] ? req.files[`trusteePhoto_${i}`][0].filename : null,
      };
      trustees.push(trustee);
      i++;
    }

    if (trustees.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "At least one trustee is required",
      });
    }

    // Parse functional domains
    const functionalDomains = [];
    i = 1;
    while (req.body[`functionalDomain_${i}`]) {
      if (req.body[`functionalDomain_${i}`].trim()) {
        functionalDomains.push(req.body[`functionalDomain_${i}`]);
      }
      i++;
    }

    // Parse purposes
    const purposes = Array.isArray(req.body.purpose) ? req.body.purpose : req.body.purpose ? [req.body.purpose] : [];
    const otherPurposes = [];
    i = 1;
    while (req.body[`otherPurpose_${i}`]) {
      if (req.body[`otherPurpose_${i}`].trim()) {
        otherPurposes.push(req.body[`otherPurpose_${i}`]);
      }
      i++;
    }

    // Parse terms
    const terms = Array.isArray(req.body.terms) ? req.body.terms : req.body.terms ? [req.body.terms] : [];
    const otherTerms = [];
    i = 1;
    while (req.body[`otherTerm_${i}`]) {
      if (req.body[`otherTerm_${i}`].trim()) {
        otherTerms.push(req.body[`otherTerm_${i}`]);
      }
      i++;
    }

    // Parse witnesses
    const witnesses = [];
    i = 1;
    while (req.body[`witnessName_${i}`]) {
      if (req.body[`witnessName_${i}`].trim()) {
        const witness = {
          name: req.body[`witnessName_${i}`],
          relation: req.body[`witnessRelation_${i}`] || "",
          address: req.body[`witnessAddress_${i}`] || "",
          mobile: req.body[`witnessMobile_${i}`] || "",
          idType: req.body[`witnessIdType_${i}`] || "",
          idNumber: req.body[`witnessIdNumber_${i}`] || "",
          idCard: req.files && req.files[`witnessIdCard_${i}`] ? req.files[`witnessIdCard_${i}`][0].filename : null,
          photo: req.files && req.files[`witnessPhoto_${i}`] ? req.files[`witnessPhoto_${i}`][0].filename : null,
        };
        witnesses.push(witness);
      }
      i++;
    }

    const trustDeed = new TrustDeed({
      trustName,
      trustAddress,
      startingAmount: {
        number: startingAmount_number,
        words: startingAmount_words,
      },
      trustees,
      functionalDomains,
      purposes,
      otherPurposes,
      terms,
      otherTerms,
      witnesses,
      meta: { status: "submitted" },
    });

    const savedTrustDeed = await trustDeed.save();

    res.status(201).json({
      status: "success",
      message: "ट्रस्ट डीड सफलतापूर्वक बनाया गया!",
      data: { trustDeed: savedTrustDeed },
    });
  } catch (error) {
    console.error("Create Trust Deed error:", error);
    if (req.files) {
      Object.values(req.files).flat().forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

// Get All Trust Deeds
export const getAllTrustDeeds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query["meta.status"] = status;

    const trustDeeds = await TrustDeed.find(query)
      .sort({ "meta.createdAt": -1 })
      .skip(skip)
      .limit(limit);

    const total = await TrustDeed.countDocuments(query);

    res.status(200).json({
      status: "success",
      results: trustDeeds.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: { trustDeeds },
    });
  } catch (error) {
    console.error("Get Trust Deeds error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

// Get Trust Deed by ID
export const getTrustDeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const trustDeed = await TrustDeed.findById(id);

    if (!trustDeed) {
      return res.status(404).json({
        status: "fail",
        message: "Trust Deed not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { trustDeed },
    });
  } catch (error) {
    console.error("Get Trust Deed by ID error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

// Update Trust Deed Status
export const updateTrustDeedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["draft", "submitted", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid status value",
      });
    }

    const trustDeed = await TrustDeed.findByIdAndUpdate(
      id,
      { "meta.status": status, "meta.updatedAt": Date.now() },
      { new: true, runValidators: true }
    );

    if (!trustDeed) {
      return res.status(404).json({
        status: "fail",
        message: "Trust Deed not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Trust Deed status updated successfully",
      data: { trustDeed },
    });
  } catch (error) {
    console.error("Update Trust Deed status error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

// Delete Trust Deed
export const deleteTrustDeed = async (req, res) => {
  try {
    const { id } = req.params;
    const trustDeed = await TrustDeed.findById(id);

    if (!trustDeed) {
      return res.status(404).json({
        status: "fail",
        message: "Trust Deed not found",
      });
    }

    const uploadDir = path.join(process.cwd(), "uploads", "trust-deeds");
    const filesToDelete = [];

    trustDeed.trustees.forEach((trustee) => {
      if (trustee.idCard) filesToDelete.push(trustee.idCard);
      if (trustee.photo) filesToDelete.push(trustee.photo);
    });

    trustDeed.witnesses.forEach((witness) => {
      if (witness.idCard) filesToDelete.push(witness.idCard);
      if (witness.photo) filesToDelete.push(witness.photo);
    });

    filesToDelete.forEach((filename) => {
      const filePath = path.join(uploadDir, filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });

    await TrustDeed.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Trust Deed deleted successfully",
    });
  } catch (error) {
    console.error("Delete Trust Deed error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};

// Get Trust Deed Statistics
export const getTrustDeedStats = async (req, res) => {
  try {
    const stats = await TrustDeed.aggregate([
      {
        $group: {
          _id: "$meta.status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      total: 0,
      draft: 0,
      submitted: 0,
      approved: 0,
      rejected: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    res.status(200).json({
      status: "success",
      data: { stats: formattedStats },
    });
  } catch (error) {
    console.error("Get Trust Deed stats error:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
};