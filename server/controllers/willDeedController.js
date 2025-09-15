import WillDeedModel from "../models/WillDeed.js";

class WillDeedController {
  static create = async (req, res) => {
    try {
      // JSON comes in 'data' field as application/json blob
      let parsed;
      try {
        parsed = req.body.data ? JSON.parse(req.body.data) : {};
      } catch (e) {
        return res.status(400).json({ status: "failed", message: "Invalid JSON in 'data' field" });
      }

      const files = (req.files || []).map(f => ({
        field: f.fieldname,
        path: f.path.replace(/\\/g, '/'),
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
      }));

      const createdBy = req.user?._id || null;

      const doc = await WillDeedModel.create({
        meta: parsed.meta || {},
        testator: parsed.testator || {},
        beneficiaries: parsed.beneficiaries || [],
        executors: parsed.executors || [],
        witnesses: parsed.witnesses || [],
        immovables: parsed.immovables || [],
        movables: parsed.movables || [],
        rules: parsed.rules || [],
        conditions: parsed.conditions || [],
        files,
        createdBy,
      });

      return res.status(201).json({ status: "success", message: "Will Deed saved", id: doc._id, files: doc.files });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: "failed", message: "Unable to save will deed" });
    }
  }
}

export default WillDeedController;


