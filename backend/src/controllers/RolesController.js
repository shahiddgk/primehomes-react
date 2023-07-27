const { badRequest, successResponse } = require("../config/responceHandler");
const { create, listIndexes } = require("../models/PeopleModel");
const PermissionsModel = require("../models/PermissionsModel");
const RolesRepo = require('../repo/RolesRepo')

const createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;

    console.log('=-==-==', { name, permissions });
    if (!name || !permissions) {
      return badRequest(res, 'Please provide the required data with the request', []);
    }

    const isNameExist = await RolesRepo.findName(name);
    if (isNameExist) {
      return successResponse(res, 'Role name already exists', [], 200);
    }

    console.log('asfksldjfkl');
    const newRole = {
      permissions, // Use the "permissions" array directly
    };
    console.log(newRole.permissions);

    const role = await RolesRepo.createNewRole(name, permissions);
    if (!role) {
      return badRequest(res, 'Something went wrong', []);
    }

    return successResponse(res, 'Role Created', role, 200);
  } catch (error) {
    next(error);
  }
};



const getAllRoles = async (req, res, next) => {
    try {
        console.log('Hellllll');
        const roles = await RolesRepo.findAllRoles();
        if (!roles) {
            return badRequest(res, 'Something Went Wrong', []);
        }
        return successResponse(res, 'All Roles', roles, 200)
      } catch (error) {
        next(error);
      }
}


const deleteARole = async (req, res, next) => {
    try {
      const roleId = req.params.id;
      const deletedRole = await RolesRepo.deleteRole(roleId);
      if (!deletedRole) {
        return badRequest(res, 'Role not found', []);
      }
  
      return successResponse(res, 'Role deleted successfully', deletedRole, 200);
    } catch (error) {
      next(error);
    }
  };

  const updateRole = async (req, res, next) => {
    try {
      const roleId = req.params.id;
      console.log(req.body);
      const { name, permissions } = req.body;
      const updatedRole = await RolesRepo.updateRole(roleId, name, permissions);
      if (!updatedRole) {
        return badRequest(res, 'Role not found', []);
      }
  
      return successResponse(res, 'Role updated successfully', updatedRole, 200);
    } catch (error) {
      next(error);
    }
  };




  const getAllPermissions = async (req, res, next) => {
    try {
      // Fetch all documents from the "permissions" collection using the Mongoose model
      const allPermissions = await PermissionsModel.find({});
  
      // Send the fetched permissions data as the API response
      return successResponse(res, 'Permissions Fetched Successfully', allPermissions, 200);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return badRequest(res, 'Something went wrong', []);
    }
  };
  
  module.exports = {
    getAllPermissions,
  };
  


module.exports = {
    createRole,
    getAllRoles,
    deleteARole,
    updateRole,
    getAllPermissions
}