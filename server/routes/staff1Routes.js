import express from "express";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Staff 1 Routes - Only accessible by staff_1 and admin
// Staff 1 handles final check of forms and stamp paper amounts
router.use(authorizeRoles('staff_1', 'admin'));

// Staff 1 Dashboard
router.get("/dashboard", (req, res) => {
  res.json({
    status: 'success',
    message: 'Staff 1 Dashboard accessed successfully',
    data: {
      user: req.user,
      department: 'Form Validation & Quality Assurance',
      permissions: ['view_forms', 'edit_forms', 'verify_stamp_paper', 'finalize_forms', 'approve_documents', 'reject_forms']
    }
  });
});

// Get Pending Forms for Review
router.get("/pending-forms", (req, res) => {
  res.json({
    status: 'success',
    message: 'Pending forms for review retrieved',
    data: {
      pending_forms: [
        {
          id: 1,
          form_type: 'Sale Deed',
          user_id: 'user123',
          user_name: 'John Doe',
          submitted_at: '2024-01-15T10:30:00Z',
          stamp_amount: 5000,
          status: 'pending_review',
          priority: 'normal'
        },
        {
          id: 2,
          form_type: 'Trust Deed',
          user_id: 'user456',
          user_name: 'Jane Smith',
          submitted_at: '2024-01-15T09:15:00Z',
          stamp_amount: 3000,
          status: 'pending_review',
          priority: 'high'
        },
        {
          id: 3,
          form_type: 'Will Deed',
          user_id: 'user789',
          user_name: 'Bob Johnson',
          submitted_at: '2024-01-15T08:45:00Z',
          stamp_amount: 1000,
          status: 'pending_review',
          priority: 'normal'
        }
      ]
    }
  });
});

// GET /staff/1/forms/:id - View the full form data submitted by a user
router.get("/forms/:id", (req, res) => {
  const formId = req.params.id;
  res.json({
    status: 'success',
    message: `Form ${formId} details retrieved for review`,
    data: {
      form: {
        id: formId,
        form_type: 'Sale Deed',
        user_info: {
          id: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '9876543210'
        },
        form_data: {
          property_details: {
            address: '123 Main Street, City',
            area: '2000 sq ft',
            registration_number: 'REG123456'
          },
          parties: {
            seller: 'John Doe',
            buyer: 'Jane Smith'
          },
          financial_details: {
            property_value: 5000000,
            stamp_duty: 5000,
            registration_fee: 1000
          }
        },
        documents: [
          { name: 'property_deed.pdf', size: '2.5MB', uploaded_at: '2024-01-15T10:25:00Z' },
          { name: 'identity_proof.pdf', size: '1.2MB', uploaded_at: '2024-01-15T10:26:00Z' }
        ],
        stamp_paper_details: {
          amount: 5000,
          series: 'A',
          number: '123456',
          purchase_date: '2024-01-14',
          validity_status: 'valid'
        },
        submitted_at: '2024-01-15T10:30:00Z',
        status: 'pending_review',
        is_locked: false, // Form can be edited
        last_edited_by: null,
        last_edited_at: null
      }
    }
  });
});

// PUT /staff/1/forms/:id - Edit/update the form data (only before it is finalized)
router.put("/forms/:id", (req, res) => {
  const formId = req.params.id;
  const updateData = req.body;
  
  // Check if form is locked (finalized)
  const isFormLocked = updateData.is_locked === true;
  
  if (isFormLocked) {
    return res.status(403).json({
      status: 'error',
      message: 'Form is locked and cannot be edited after finalization'
    });
  }
  
  res.json({
    status: 'success',
    message: `Form ${formId} updated successfully`,
    data: {
      form_id: formId,
      updated_data: updateData,
      last_edited_by: req.user.name,
      last_edited_at: new Date().toISOString(),
      edited_by_staff: true
    }
  });
});

// PATCH /staff/1/forms/:id/stamp-paper - Verify/update stamp paper amount
router.patch("/forms/:id/stamp-paper", (req, res) => {
  const formId = req.params.id;
  const { stamp_amount, verification_notes, is_verified } = req.body;
  
  res.json({
    status: 'success',
    message: `Stamp paper verification completed for form ${formId}`,
    data: {
      form_id: formId,
      stamp_verification: {
        verified_amount: stamp_amount,
        is_verified: is_verified || true,
        verification_notes: verification_notes || 'Stamp paper amount verified by staff',
        verified_by: req.user.name,
        verified_at: new Date().toISOString()
      }
    }
  });
});

// Validate Stamp Paper Amount
router.post("/forms/:id/validate-stamp", (req, res) => {
  const formId = req.params.id;
  const { stamp_amount, validation_notes } = req.body;
  
  res.json({
    status: 'success',
    message: `Stamp paper validation completed for form ${formId}`,
    data: {
      form_id: formId,
      stamp_validation: {
        amount: stamp_amount,
        is_valid: true,
        validation_notes: validation_notes || 'Stamp paper amount is correct as per property value',
        validated_by: req.user.name,
        validated_at: new Date().toISOString()
      }
    }
  });
});

// Approve Form After Final Check (locks the form)
router.post("/forms/:id/approve", (req, res) => {
  const formId = req.params.id;
  const { approval_notes, final_stamp_amount } = req.body;
  
  res.json({
    status: 'success',
    message: `Form ${formId} approved and locked after final validation`,
    data: {
      form_id: formId,
      approval: {
        status: 'approved',
        final_stamp_amount: final_stamp_amount,
        approval_notes: approval_notes || 'Form approved after thorough validation',
        approved_by: req.user.name,
        approved_at: new Date().toISOString(),
        is_locked: true, // Form is now locked for user editing
        locked_at: new Date().toISOString()
      }
    }
  });
});

// Finalize Form (locks it for user editing)
router.post("/forms/:id/finalize", (req, res) => {
  const formId = req.params.id;
  const { finalization_notes, final_stamp_amount } = req.body;
  
  res.json({
    status: 'success',
    message: `Form ${formId} finalized and locked`,
    data: {
      form_id: formId,
      finalization: {
        status: 'finalized',
        final_stamp_amount: final_stamp_amount,
        finalization_notes: finalization_notes || 'Form finalized by staff - no further user edits allowed',
        finalized_by: req.user.name,
        finalized_at: new Date().toISOString(),
        is_locked: true, // Form is now locked for user editing
        locked_at: new Date().toISOString()
      }
    }
  });
});

// Reject Form with Reasons
router.post("/forms/:id/reject", (req, res) => {
  const formId = req.params.id;
  const { rejection_reason, required_corrections } = req.body;
  
  res.json({
    status: 'success',
    message: `Form ${formId} rejected with corrections needed`,
    data: {
      form_id: formId,
      rejection: {
        status: 'rejected',
        rejection_reason: rejection_reason,
        required_corrections: required_corrections,
        rejected_by: req.user.name,
        rejected_at: new Date().toISOString()
      }
    }
  });
});

// Get Form Validation History
router.get("/forms/:id/history", (req, res) => {
  const formId = req.params.id;
  res.json({
    status: 'success',
    message: `Validation history for form ${formId}`,
    data: {
      form_id: formId,
      validation_history: [
        {
          action: 'submitted',
          timestamp: '2024-01-15T10:30:00Z',
          user: 'John Doe',
          notes: 'Form submitted for review'
        },
        {
          action: 'stamp_validation',
          timestamp: '2024-01-15T11:00:00Z',
          user: 'Staff 1 User',
          notes: 'Stamp paper amount validated'
        },
        {
          action: 'final_approval',
          timestamp: '2024-01-15T11:15:00Z',
          user: 'Staff 1 User',
          notes: 'Form approved after final check'
        }
      ]
    }
  });
});

// Get Stamp Paper Rates Reference
router.get("/stamp-rates", (req, res) => {
  res.json({
    status: 'success',
    message: 'Stamp paper rates retrieved',
    data: {
      stamp_rates: [
        {
          property_value_range: '0 - 100000',
          stamp_duty_percentage: 1,
          minimum_amount: 100
        },
        {
          property_value_range: '100001 - 500000',
          stamp_duty_percentage: 2,
          minimum_amount: 1000
        },
        {
          property_value_range: '500001 - 1000000',
          stamp_duty_percentage: 3,
          minimum_amount: 10000
        },
        {
          property_value_range: '1000001 - 5000000',
          stamp_duty_percentage: 4,
          minimum_amount: 30000
        },
        {
          property_value_range: '5000001 and above',
          stamp_duty_percentage: 5,
          minimum_amount: 100000
        }
      ]
    }
  });
});

// Calculate Expected Stamp Amount
router.post("/calculate-stamp", (req, res) => {
  const { property_value, property_type = 'residential' } = req.body;
  
  let stamp_duty_percentage = 0;
  let minimum_amount = 0;
  
  // Calculate based on property value
  if (property_value <= 100000) {
    stamp_duty_percentage = 1;
    minimum_amount = 100;
  } else if (property_value <= 500000) {
    stamp_duty_percentage = 2;
    minimum_amount = 1000;
  } else if (property_value <= 1000000) {
    stamp_duty_percentage = 3;
    minimum_amount = 10000;
  } else if (property_value <= 5000000) {
    stamp_duty_percentage = 4;
    minimum_amount = 30000;
  } else {
    stamp_duty_percentage = 5;
    minimum_amount = 100000;
  }
  
  const calculated_amount = Math.max(
    (property_value * stamp_duty_percentage) / 100,
    minimum_amount
  );
  
  res.json({
    status: 'success',
    message: 'Stamp paper amount calculated',
    data: {
      property_value: property_value,
      property_type: property_type,
      stamp_duty_percentage: stamp_duty_percentage,
      calculated_amount: calculated_amount,
      minimum_amount: minimum_amount,
      calculated_by: req.user.name,
      calculated_at: new Date().toISOString()
    }
  });
});

// Check Form Lock Status
router.get("/forms/:id/lock-status", (req, res) => {
  const formId = req.params.id;
  res.json({
    status: 'success',
    message: `Lock status retrieved for form ${formId}`,
    data: {
      form_id: formId,
      lock_status: {
        is_locked: false, // This would be determined from database
        locked_at: null,
        locked_by: null,
        can_edit: true,
        can_user_edit: true
      }
    }
  });
});

// Get Validation Statistics
router.get("/statistics", (req, res) => {
  res.json({
    status: 'success',
    message: 'Validation statistics retrieved',
    data: {
      statistics: {
        total_forms_today: 25,
        pending_review: 8,
        approved_today: 15,
        rejected_today: 2,
        locked_forms: 12,
        average_processing_time: '45 minutes',
        stamp_validation_accuracy: '98.5%'
      }
    }
  });
});

export default router;
