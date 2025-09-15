import TrustDeedModel from "../models/TrustDeed.js";

class TrustDeedController {
  static create = async (req, res) => {
    try {
      // Parse form data from request body
      const {
        trustName,
        trustAddress,
        startingAmount_number,
        startingAmount_words,
        // Trustees data
        trusteeSalutation_1,
        trusteePosition_1,
        trusteeName_1,
        trusteeRelation_1,
        trusteeAddress_1,
        trusteeMobile_1,
        trusteeIdType_1,
        trusteeIdNumber_1,
        // Functional domains
        functionalDomain_1,
        // Purposes
        purpose,
        otherPurpose_1,
        // Terms
        terms,
        otherTerm_1,
        // Witnesses
        witnessName_1,
        witnessRelation_1,
        witnessAddress_1,
        witnessMobile_1,
        witnessIdType_1,
        witnessIdNumber_1,
        witnessName_2,
        witnessRelation_2,
        witnessAddress_2,
        witnessMobile_2,
        witnessIdType_2,
        witnessIdNumber_2,
        ...otherFields
      } = req.body;

      // Validation
      if (!trustName || !trustAddress || !startingAmount_number || !startingAmount_words) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required fields: trustName, trustAddress, startingAmount_number, startingAmount_words"
        });
      }

      // Process trustees data
      const trustees = [];
      let trusteeIndex = 1;
      
      while (req.body[`trusteeName_${trusteeIndex}`]) {
        const trustee = {
          salutation: req.body[`trusteeSalutation_${trusteeIndex}`] || 'श्री',
          position: req.body[`trusteePosition_${trusteeIndex}`],
          name: req.body[`trusteeName_${trusteeIndex}`],
          relation: req.body[`trusteeRelation_${trusteeIndex}`],
          address: req.body[`trusteeAddress_${trusteeIndex}`],
          mobile: req.body[`trusteeMobile_${trusteeIndex}`],
          idType: req.body[`trusteeIdType_${trusteeIndex}`] || 'आधार कार्ड',
          idNumber: req.body[`trusteeIdNumber_${trusteeIndex}`],
          idCardFile: null,
          photoFile: null
        };

        // Validate required trustee fields
        if (!trustee.position || !trustee.name || !trustee.relation || !trustee.address || !trustee.mobile || !trustee.idNumber) {
          return res.status(400).json({
            status: "failed",
            message: `Missing required trustee fields for trustee ${trusteeIndex}`
          });
        }

        trustees.push(trustee);
        trusteeIndex++;
      }

      // Process functional domains
      const functionalDomains = [];
      let domainIndex = 1;
      while (req.body[`functionalDomain_${domainIndex}`]) {
        functionalDomains.push(req.body[`functionalDomain_${domainIndex}`]);
        domainIndex++;
      }

      // Process purposes
      const purposes = Array.isArray(purpose) ? purpose : (purpose ? [purpose] : []);
      const otherPurposes = [];
      let purposeIndex = 1;
      while (req.body[`otherPurpose_${purposeIndex}`]) {
        otherPurposes.push(req.body[`otherPurpose_${purposeIndex}`]);
        purposeIndex++;
      }

      // Process terms
      const termsArray = Array.isArray(terms) ? terms : (terms ? [terms] : []);
      const otherTerms = [];
      let termIndex = 1;
      while (req.body[`otherTerm_${termIndex}`]) {
        otherTerms.push(req.body[`otherTerm_${termIndex}`]);
        termIndex++;
      }

      // Process witnesses
      const witnesses = [];
      
      // Witness 1
      if (witnessName_1) {
        witnesses.push({
          name: witnessName_1,
          relation: witnessRelation_1 || '',
          address: witnessAddress_1 || '',
          mobile: witnessMobile_1 || '',
          idType: witnessIdType_1 || 'आधार कार्ड',
          idNumber: witnessIdNumber_1 || '',
          idCardFile: null,
          photoFile: null
        });
      }

      // Witness 2
      if (witnessName_2) {
        witnesses.push({
          name: witnessName_2,
          relation: witnessRelation_2 || '',
          address: witnessAddress_2 || '',
          mobile: witnessMobile_2 || '',
          idType: witnessIdType_2 || 'आधार कार्ड',
          idNumber: witnessIdNumber_2 || '',
          idCardFile: null,
          photoFile: null
        });
      }

      // Process file uploads
      const files = (req.files || []).map(f => ({
        field: f.fieldname,
        path: f.path.replace(/\\/g, '/'),
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
      }));

      // Map file uploads to trustees and witnesses
      files.forEach(file => {
        const fieldName = file.field;
        
        // Trustee files
        if (fieldName.includes('trusteeIdCard_')) {
          const trusteeIndex = parseInt(fieldName.split('_')[2]) - 1;
          if (trustees[trusteeIndex]) {
            trustees[trusteeIndex].idCardFile = file.path;
          }
        } else if (fieldName.includes('trusteePhoto_')) {
          const trusteeIndex = parseInt(fieldName.split('_')[2]) - 1;
          if (trustees[trusteeIndex]) {
            trustees[trusteeIndex].photoFile = file.path;
          }
        }
        
        // Witness files
        if (fieldName.includes('witnessIdCard_')) {
          const witnessIndex = parseInt(fieldName.split('_')[2]) - 1;
          if (witnesses[witnessIndex]) {
            witnesses[witnessIndex].idCardFile = file.path;
          }
        } else if (fieldName.includes('witnessPhoto_')) {
          const witnessIndex = parseInt(fieldName.split('_')[2]) - 1;
          if (witnesses[witnessIndex]) {
            witnesses[witnessIndex].photoFile = file.path;
          }
        }
      });

      const createdBy = req.user?._id || null;

      // Create trust deed document
      const trustDeed = await TrustDeedModel.create({
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
        terms: termsArray,
        otherTerms,
        witnesses,
        files,
        createdBy,
      });

      return res.status(201).json({
        status: "success",
        message: "Trust Deed created successfully",
        data: {
          id: trustDeed._id,
          trustName: trustDeed.trustName,
          created_at: trustDeed.created_at,
          files: trustDeed.files
        }
      });

    } catch (error) {
      console.error('Trust Deed creation error:', error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to create trust deed",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

  static getAll = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const filter = {};
      if (req.user?._id) {
        filter.createdBy = req.user._id;
      }

      const trustDeeds = await TrustDeedModel.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .select('trustName trustAddress startingAmount created_at trustees.name trustees.position');

      const total = await TrustDeedModel.countDocuments(filter);

      return res.status(200).json({
        status: "success",
        data: {
          trustDeeds,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      console.error('Get trust deeds error:', error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch trust deeds"
      });
    }
  };

  static getById = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid trust deed ID"
        });
      }

      const trustDeed = await TrustDeedModel.findById(id);
      
      if (!trustDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Trust deed not found"
        });
      }

      // Check if user has access to this trust deed
      if (req.user?._id && trustDeed.createdBy && trustDeed.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "failed",
          message: "Access denied"
        });
      }

      return res.status(200).json({
        status: "success",
        data: trustDeed
      });

    } catch (error) {
      console.error('Get trust deed error:', error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch trust deed"
      });
    }
  };

  static update = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid trust deed ID"
        });
      }

      const trustDeed = await TrustDeedModel.findById(id);
      
      if (!trustDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Trust deed not found"
        });
      }

      // Check if user has access to update this trust deed
      if (req.user?._id && trustDeed.createdBy && trustDeed.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "failed",
          message: "Access denied"
        });
      }

      // Update logic would go here (similar to create but with findByIdAndUpdate)
      // For now, return not implemented
      return res.status(501).json({
        status: "failed",
        message: "Update functionality not yet implemented"
      });

    } catch (error) {
      console.error('Update trust deed error:', error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to update trust deed"
      });
    }
  };

  static delete = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid trust deed ID"
        });
      }

      const trustDeed = await TrustDeedModel.findById(id);
      
      if (!trustDeed) {
        return res.status(404).json({
          status: "failed",
          message: "Trust deed not found"
        });
      }

      // Check if user has access to delete this trust deed
      if (req.user?._id && trustDeed.createdBy && trustDeed.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          status: "failed",
          message: "Access denied"
        });
      }

      await TrustDeedModel.findByIdAndDelete(id);

      return res.status(200).json({
        status: "success",
        message: "Trust deed deleted successfully"
      });

    } catch (error) {
      console.error('Delete trust deed error:', error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to delete trust deed"
      });
    }
  };

  static getStats = async (req, res) => {
    try {
      const filter = {};
      if (req.user?._id) {
        filter.createdBy = req.user._id;
      }

      const totalTrustDeeds = await TrustDeedModel.countDocuments(filter);
      
      const stats = await TrustDeedModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalTrustDeeds: { $sum: 1 },
            totalTrustees: { $sum: { $size: "$trustees" } },
            avgTrusteesPerDeed: { $avg: { $size: "$trustees" } }
          }
        }
      ]);

      return res.status(200).json({
        status: "success",
        data: {
          totalTrustDeeds,
          ...(stats[0] || { totalTrustees: 0, avgTrusteesPerDeed: 0 })
        }
      });

    } catch (error) {
      console.error('Get stats error:', error);
      return res.status(500).json({
        status: "failed",
        message: "Unable to fetch statistics"
      });
    }
  };
}

export default TrustDeedController;
