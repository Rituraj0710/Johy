import express from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Staff 6 Routes - Only accessible by staff_6 and admin
router.use(authorizeRoles('staff_6', 'admin'));

// Staff 6 Dashboard
router.get("/dashboard", (req, res) => {
  res.json({
    status: 'success',
    message: 'Staff 6 Dashboard accessed successfully',
    data: {
      user: req.user,
      department: 'Staff 6 Department',
      permissions: ['manage_tickets', 'view_issues', 'resolve_complaints']
    }
  });
});

// Support Tickets
router.get("/tickets", (req, res) => {
  res.json({
    status: 'success',
    message: 'Support tickets retrieved',
    data: {
      tickets: [
        { id: 1, title: 'Login Issue', priority: 'high', status: 'open', customer: 'user@example.com' },
        { id: 2, title: 'Feature Request', priority: 'medium', status: 'in_progress', customer: 'client@company.com' },
        { id: 3, title: 'Bug Report', priority: 'high', status: 'resolved', customer: 'test@domain.com' }
      ]
    }
  });
});

// Ticket Details
router.get("/tickets/:id", (req, res) => {
  res.json({
    status: 'success',
    message: `Ticket ${req.params.id} details retrieved`,
    data: {
      ticket: {
        id: req.params.id,
        title: 'Sample Issue',
        description: 'Detailed description of the issue',
        priority: 'high',
        status: 'open',
        customer: 'customer@example.com',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      }
    }
  });
});

// Update Ticket Status
router.put("/tickets/:id", (req, res) => {
  res.json({
    status: 'success',
    message: `Ticket ${req.params.id} updated successfully`,
    data: req.body
  });
});

// Create Ticket
router.post("/tickets", (req, res) => {
  res.json({
    status: 'success',
    message: 'Support ticket created successfully',
    data: req.body
  });
});

// Knowledge Base
router.get("/knowledge-base", (req, res) => {
  res.json({
    status: 'success',
    message: 'Knowledge base articles retrieved',
    data: {
      articles: [
        { id: 1, title: 'How to reset password', category: 'Account', views: 1250 },
        { id: 2, title: 'Payment troubleshooting', category: 'Billing', views: 890 },
        { id: 3, title: 'Feature guide', category: 'Usage', views: 2100 }
      ]
    }
  });
});

// Customer Feedback
router.get("/feedback", (req, res) => {
  res.json({
    status: 'success',
    message: 'Customer feedback retrieved',
    data: {
      feedback: [
        { id: 1, rating: 5, comment: 'Excellent service!', customer: 'user1@example.com' },
        { id: 2, rating: 4, comment: 'Good support team', customer: 'user2@example.com' }
      ]
    }
  });
});

export default router;
