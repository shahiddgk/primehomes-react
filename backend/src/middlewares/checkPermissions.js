const { badRequest } = require("../config/responceHandler");
const RolesModel = require("../models/RolesModel");

// Updated checkPermission middleware
const checkPermission = (permissions) => async (req, res, next) => {
  try {
    // Convert the permissions parameter to an array if it's a single permission string
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

    // Check if req.user and req.user.role exist
    if (!req.userData || !req.userData.role) {
      res.status(403).json({ error: 'User role not found' });
      return;
    }
    // Find the user's role in the database
    const userRole = await RolesModel.findOne({ name: req.userData.role });
    console.log(userRole.permissions);
    // Check if the role exists and has at least one of the required permissions
    if (
      !userRole ||
      !userRole.permissions ||
      !userRole.permissions.some((permission) => requiredPermissions.includes(permission))
    ) {
      return badRequest(res, 'Permission denied',[], 403);
    }

    // User has at least one of the required permissions, proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


  module.exports = checkPermission
