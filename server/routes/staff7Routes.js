import express from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Staff 7 Routes - Only accessible by staff_7 and admin
router.use(authorizeRoles('staff_7', 'admin'));

// Staff 7 Dashboard
router.get("/dashboard", (req, res) => {
  res.json({
    status: 'success',
    message: 'Staff 7 Dashboard accessed successfully',
    data: {
      user: req.user,
      department: 'Staff 7 Department',
      permissions: ['manage_assignments', 'track_location', 'submit_reports']
    }
  });
});

// Field Assignments
router.get("/assignments", (req, res) => {
  res.json({
    status: 'success',
    message: 'Field assignments retrieved',
    data: {
      assignments: [
        { id: 1, location: 'Site A', type: 'Inspection', status: 'in_progress', priority: 'high' },
        { id: 2, location: 'Site B', type: 'Maintenance', status: 'pending', priority: 'medium' },
        { id: 3, location: 'Site C', type: 'Delivery', status: 'completed', priority: 'low' }
      ]
    }
  });
});

// Location Tracking
router.get("/location", (req, res) => {
  res.json({
    status: 'success',
    message: 'Current location retrieved',
    data: {
      location: {
        latitude: 28.6139,
        longitude: 77.2090,
        address: 'New Delhi, India',
        last_updated: '2024-01-15T14:30:00Z'
      }
    }
  });
});

// Update Location
router.post("/location", (req, res) => {
  res.json({
    status: 'success',
    message: 'Location updated successfully',
    data: req.body
  });
});

// Field Reports
router.get("/reports", (req, res) => {
  res.json({
    status: 'success',
    message: 'Field reports retrieved',
    data: {
      reports: [
        { id: 1, assignment_id: 1, report_type: 'Inspection Report', status: 'completed', date: '2024-01-15' },
        { id: 2, assignment_id: 2, report_type: 'Maintenance Log', status: 'draft', date: '2024-01-14' }
      ]
    }
  });
});

// Submit Report
router.post("/reports", (req, res) => {
  res.json({
    status: 'success',
    message: 'Field report submitted successfully',
    data: req.body
  });
});

// Equipment Management
router.get("/equipment", (req, res) => {
  res.json({
    status: 'success',
    message: 'Equipment list retrieved',
    data: {
      equipment: [
        { id: 1, name: 'Safety Helmet', status: 'available', last_maintenance: '2024-01-10' },
        { id: 2, name: 'Measuring Tape', status: 'in_use', last_maintenance: '2024-01-12' },
        { id: 3, name: 'Camera', status: 'available', last_maintenance: '2024-01-08' }
      ]
    }
  });
});

// Check-in/Check-out Equipment
router.post("/equipment/:id/checkout", (req, res) => {
  res.json({
    status: 'success',
    message: `Equipment ${req.params.id} checked out successfully`,
    data: req.body
  });
});

router.post("/equipment/:id/checkin", (req, res) => {
  res.json({
    status: 'success',
    message: `Equipment ${req.params.id} checked in successfully`,
    data: req.body
  });
});

export default router;
