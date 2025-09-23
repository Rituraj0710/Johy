import passport from "passport";

/**
 * Middleware to authorize users based on their roles
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {Function} Express middleware function
 */
const authorizeRoles = (...allowedRoles) => {
  return [
    // First authenticate the user using JWT
    passport.authenticate('jwt', { session: false }),
    
    // Then check if user has required role
    (req, res, next) => {
      try {
        // Check if user is authenticated
        if (!req.user) {
          return res.status(401).json({
            status: 'fail',
            message: 'Authentication required'
          });
        }

        // Get user roles
        const userRoles = req.user.roles || [];
        
        // Check if user has any of the allowed roles
        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        
        if (!hasRequiredRole) {
          return res.status(403).json({
            status: 'fail',
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your roles: ${userRoles.join(', ')}`
          });
        }

        // User has required role, proceed to next middleware
        next();
      } catch (error) {
        console.error('Error in authorizeRoles middleware:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Internal server error during authorization'
        });
      }
    }
  ];
};

/**
 * Helper function to create role-based middleware with pattern matching
 * @param {string} rolePattern - Pattern to match (e.g., 'staff_*' for all staff roles)
 * @returns {Function} Express middleware function
 */
const authorizeRolePattern = (rolePattern) => {
  return [
    passport.authenticate('jwt', { session: false }),
    
    (req, res, next) => {
      try {
        if (!req.user) {
          return res.status(401).json({
            status: 'fail',
            message: 'Authentication required'
          });
        }

        const userRoles = req.user.roles || [];
        
        // Check for pattern matching
        let hasRequiredRole = false;
        
        if (rolePattern === 'staff_*') {
          // Match all staff roles
          hasRequiredRole = userRoles.some(role => 
            role.startsWith('staff_') || role === 'admin'
          );
        } else if (rolePattern === 'admin') {
          // Only admin
          hasRequiredRole = userRoles.includes('admin');
        } else if (rolePattern === 'user_or_staff') {
          // User or any staff role
          hasRequiredRole = userRoles.some(role => 
            role === 'user' || role.startsWith('staff_') || role === 'admin'
          );
        } else {
          // Exact role match
          hasRequiredRole = userRoles.includes(rolePattern);
        }
        
        if (!hasRequiredRole) {
          return res.status(403).json({
            status: 'fail',
            message: `Access denied. Required: ${rolePattern}. Your roles: ${userRoles.join(', ')}`
          });
        }

        next();
      } catch (error) {
        console.error('Error in authorizeRolePattern middleware:', error);
        return res.status(500).json({
          status: 'error',
          message: 'Internal server error during authorization'
        });
      }
    }
  ];
};

export { authorizeRoles, authorizeRolePattern };
export default authorizeRoles;
