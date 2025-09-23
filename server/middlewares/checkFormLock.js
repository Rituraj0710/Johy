/**
 * Middleware to check if a form is locked for user editing
 * This prevents users from editing forms that have been finalized by staff_1
 */

const checkFormLock = (req, res, next) => {
  try {
    const formId = req.params.id || req.params.formId;
    const userRoles = req.user?.roles || [];
    
    // If user is admin or staff_1, they can always edit (bypass lock check)
    if (userRoles.includes('admin') || userRoles.includes('staff_1')) {
      return next();
    }
    
    // For regular users, check if form is locked
    // In a real implementation, you would query the database here
    // For now, we'll simulate the check
    
    // Simulate checking form lock status from database
    const isFormLocked = req.body?.is_locked === true || req.query?.is_locked === 'true';
    
    if (isFormLocked) {
      return res.status(403).json({
        status: 'error',
        message: 'Form is locked and cannot be edited. Contact staff for assistance.',
        error_code: 'FORM_LOCKED',
        data: {
          form_id: formId,
          locked_at: new Date().toISOString(),
          locked_by: 'staff_1',
          can_edit: false
        }
      });
    }
    
    // Form is not locked, proceed to next middleware
    next();
  } catch (error) {
    console.error('Error in checkFormLock middleware:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while checking form lock status'
    });
  }
};

/**
 * Middleware to check if user can edit forms based on their role and form status
 */
const checkFormEditPermission = (req, res, next) => {
  try {
    const userRoles = req.user?.roles || [];
    const formId = req.params.id || req.params.formId;
    
    // Admin and staff_1 can always edit forms
    if (userRoles.includes('admin') || userRoles.includes('staff_1')) {
      return next();
    }
    
    // Regular users can only edit forms that are not locked
    // This would typically involve a database query to check form status
    const isFormLocked = req.body?.is_locked === true || req.query?.is_locked === 'true';
    
    if (isFormLocked) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to edit this form. It has been finalized by staff.',
        error_code: 'INSUFFICIENT_PERMISSIONS',
        data: {
          form_id: formId,
          user_roles: userRoles,
          required_roles: ['staff_1', 'admin']
        }
      });
    }
    
    next();
  } catch (error) {
    console.error('Error in checkFormEditPermission middleware:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while checking form edit permissions'
    });
  }
};

export { checkFormLock, checkFormEditPermission };
export default checkFormLock;
