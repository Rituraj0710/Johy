// import WillDeedModel from "../models/WillDeed.js";

// class WillDeedController {
//   static create = async (req, res) => {
//     try {
//       // JSON comes in 'data' field as application/json blob
//       let parsed;
//       try {
//         parsed = req.body.data ? JSON.parse(req.body.data) : {};
//       } catch (e) {
//         return res.status(400).json({ status: "failed", message: "Invalid JSON in 'data' field" });
//       }

//       const files = (req.files || []).map(f => ({
//         field: f.fieldname,
//         path: f.path.replace(/\\/g, '/'),
//         originalName: f.originalname,
//         mimeType: f.mimetype,
//         size: f.size,
//       }));

//       const createdBy = req.user?._id || null;

//       const doc = await WillDeedModel.create({
//         meta: parsed.meta || {},
//         testator: parsed.testator || {},
//         beneficiaries: parsed.beneficiaries || [],
//         executors: parsed.executors || [],
//         witnesses: parsed.witnesses || [],
//         immovables: parsed.immovables || [],
//         movables: parsed.movables || [],
//         rules: parsed.rules || [],
//         conditions: parsed.conditions || [],
//         files,
//         createdBy,
//       });

//       return res.status(201).json({ status: "success", message: "Will Deed saved", id: doc._id, files: doc.files });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ status: "failed", message: "Unable to save will deed" });
//     }
//   }
// }

// export default WillDeedController;


// controllers/willDeedController.js
import WillDeed from "../models/WillDeed.js";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads", "will-deeds");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  if (file.fieldname.includes('photo')) {
    // Only images for photos
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for photos'), false);
    }
  } else if (file.fieldname.includes('id')) {
    // Images and PDFs for ID documents
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed for ID documents'), false);
    }
  } else {
    cb(null, true);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Submit Will Deed
export const submitWillDeed = async (req, res) => {
  try {
    // Parse JSON data from form
    const data = JSON.parse(req.body.data);

    // Validate required fields
    if (!data.testator || !data.testator.name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Testator name is required'
      });
    }

    if (!data.beneficiaries || data.beneficiaries.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'At least one beneficiary is required'
      });
    }

    if (!data.executors || data.executors.length === 0) {
      return res.status(400).json({
        status: 'fail',
        message: 'At least one executor is required'
      });
    }

    if (!data.witnesses || data.witnesses.length < 2) {
      return res.status(400).json({
        status: 'fail',
        message: 'At least two witnesses are required'
      });
    }

    // Process uploaded files
    const uploads = {
      testatorId: null,
      testatorPhoto: null,
      personIds: [],
      personPhotos: []
    };

    if (req.files) {
      // Handle testator files
      if (req.files.testator_id) {
        uploads.testatorId = req.files.testator_id[0].filename;
      }
      if (req.files.testator_photo) {
        uploads.testatorPhoto = req.files.testator_photo[0].filename;
      }

      // Handle person ID uploads
      Object.keys(req.files).forEach(key => {
        if (key.startsWith('person_id_')) {
          uploads.personIds.push(req.files[key][0].filename);
        }
        if (key.startsWith('person_photo_')) {
          uploads.personPhotos.push(req.files[key][0].filename);
        }
      });
    }

    // Create Will Deed document
    const willDeed = new WillDeed({
      ...data,
      uploads,
      createdBy: req.user?.id || null, // If authentication is implemented
      meta: {
        ...data.meta,
        status: 'submitted'
      }
    });

    const savedWillDeed = await willDeed.save();

    res.status(201).json({
      status: 'success',
      message: 'Will Deed submitted successfully',
      data: {
        willDeed: savedWillDeed
      }
    });

  } catch (error) {
    console.error('Will Deed submission error:', error);

    // Clean up uploaded files if document creation fails
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }

    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

// Get all Will Deeds
export const getAllWillDeeds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status) query['meta.status'] = status;
    if (req.user) query.createdBy = req.user.id; // If authentication is implemented

    const willDeeds = await WillDeed.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await WillDeed.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: willDeeds.length,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: {
        willDeeds
      }
    });

  } catch (error) {
    console.error('Get Will Deeds error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

// Get Will Deed by ID
export const getWillDeedById = async (req, res) => {
  try {
    const { id } = req.params;

    const willDeed = await WillDeed.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email');

    if (!willDeed) {
      return res.status(404).json({
        status: 'fail',
        message: 'Will Deed not found'
      });
    }

    // Check if user has permission to view this will deed
    if (req.user && willDeed.createdBy && willDeed.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to view this Will Deed'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        willDeed
      }
    });

  } catch (error) {
    console.error('Get Will Deed by ID error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

// Update Will Deed status (for admin/agent use)
export const updateWillDeedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedAgent } = req.body;

    const validStatuses = ['draft', 'submitted', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid status value'
      });
    }

    const updateData = { 'meta.status': status };
    if (assignedAgent) updateData.assignedAgent = assignedAgent;

    const willDeed = await WillDeed.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email')
      .populate('assignedAgent', 'name email');

    if (!willDeed) {
      return res.status(404).json({
        status: 'fail',
        message: 'Will Deed not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Will Deed status updated successfully',
      data: {
        willDeed
      }
    });

  } catch (error) {
    console.error('Update Will Deed status error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

// Delete Will Deed
export const deleteWillDeed = async (req, res) => {
  try {
    const { id } = req.params;

    const willDeed = await WillDeed.findById(id);

    if (!willDeed) {
      return res.status(404).json({
        status: 'fail',
        message: 'Will Deed not found'
      });
    }

    // Check if user has permission to delete this will deed
    if (req.user && willDeed.createdBy && willDeed.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to delete this Will Deed'
      });
    }

    // Delete associated files
    const uploadDir = path.join(process.cwd(), "uploads", "will-deeds");

    const filesToDelete = [
      willDeed.uploads?.testatorId,
      willDeed.uploads?.testatorPhoto,
      ...(willDeed.uploads?.personIds || []),
      ...(willDeed.uploads?.personPhotos || [])
    ].filter(Boolean);

    filesToDelete.forEach(filename => {
      const filePath = path.join(uploadDir, filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });

    await WillDeed.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Will Deed deleted successfully'
    });

  } catch (error) {
    console.error('Delete Will Deed error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};

// Get Will Deed statistics
export const getWillDeedStats = async (req, res) => {
  try {
    const stats = await WillDeed.aggregate([
      {
        $group: {
          _id: '$meta.status',
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
      status: 'success',
      data: {
        stats: formattedStats
      }
    });

  } catch (error) {
    console.error('Get Will Deed stats error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
};