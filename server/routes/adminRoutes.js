import express from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Admin Routes - Only accessible by admin
router.use(authorizeRoles('admin'));

// Admin Dashboard
router.get("/dashboard", (req, res) => {
  res.json({
    status: 'success',
    message: 'Admin Dashboard accessed successfully',
    data: {
      user: req.user,
      role: 'admin',
      permissions: ['manage_users', 'manage_system', 'view_analytics', 'manage_roles']
    }
  });
});

// User Management
router.get("/users", (req, res) => {
  res.json({
    status: 'success',
    message: 'Users retrieved',
    data: {
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', roles: ['user'], status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', roles: ['staff_hr'], status: 'active' },
        { id: 3, name: 'Admin User', email: 'admin@example.com', roles: ['admin'], status: 'active' }
      ]
    }
  });
});

// Assign Role to User
router.put("/users/:id/role", (req, res) => {
  res.json({
    status: 'success',
    message: `Role assigned to user ${req.params.id} successfully`,
    data: req.body
  });
});

// System Settings
router.get("/settings", (req, res) => {
  res.json({
    status: 'success',
    message: 'System settings retrieved',
    data: {
      settings: {
        site_name: 'Document Management System',
        maintenance_mode: false,
        registration_enabled: true,
        email_notifications: true
      }
    }
  });
});

// Update System Settings
router.put("/settings", (req, res) => {
  res.json({
    status: 'success',
    message: 'System settings updated successfully',
    data: req.body
  });
});

// System Analytics
router.get("/analytics", (req, res) => {
  res.json({
    status: 'success',
    message: 'System analytics retrieved',
    data: {
      analytics: {
        total_users: 1250,
        active_users: 980,
        total_documents: 5500,
        system_health: 'excellent',
        server_uptime: '99.9%'
      }
    }
  });
});

// Audit Logs
router.get("/audit-logs", (req, res) => {
  res.json({
    status: 'success',
    message: 'Audit logs retrieved',
    data: {
      logs: [
        { id: 1, user: 'admin@example.com', action: 'user_created', timestamp: '2024-01-15T10:30:00Z' },
        { id: 2, user: 'staff_hr@example.com', action: 'role_assigned', timestamp: '2024-01-15T09:15:00Z' },
        { id: 3, user: 'user@example.com', action: 'document_uploaded', timestamp: '2024-01-15T08:45:00Z' }
      ]
    }
  });
});

// Backup Management
router.get("/backups", (req, res) => {
  res.json({
    status: 'success',
    message: 'Backup information retrieved',
    data: {
      backups: [
        { id: 1, name: 'backup_2024_01_15', size: '2.5GB', created_at: '2024-01-15T02:00:00Z', status: 'completed' },
        { id: 2, name: 'backup_2024_01_14', size: '2.3GB', created_at: '2024-01-14T02:00:00Z', status: 'completed' }
      ]
    }
  });
});

// Create Backup
router.post("/backups", (req, res) => {
  res.json({
    status: 'success',
    message: 'Backup initiated successfully',
    data: req.body
  });
});

export default router;
