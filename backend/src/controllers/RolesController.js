const { badRequest, successResponse } = require("../config/responceHandler");
const { create, listIndexes } = require("../models/PeopleModel");
const RolesRepo = require('../repo/RolesRepo')

const createRole =  async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, roles } = req.body;
        
        if (!name) {
            return badRequest(res, 'Please Provide the required data with request', [])
        }      

        const isNameExist = await RolesRepo.findName(name);
        if (isNameExist) {
            return successResponse(res, 'Already Exist', [], 200)
        }
        const newRole = {
            roleList: roles['role-list'],
            roleCreate: roles['role-create'],
            roleEdit: roles['role-edit'],
            roleDelete: roles['role-delete'],
            ownerList: roles['owner-list'],
            ownerCreate: roles['owner-create'],
            ownerEdit: roles['owner-edit'],
            ownerDelete: roles['owner-delete'],
          };
      console.log(newRole);
        const role = await RolesRepo.createNewRole(name,newRole);
        if (!role) {
            return badRequest(res, 'Something went wrong', [])
        }

        return successResponse(res, 'Role Created',role,200)

    } catch (error) {
        next(error)
    }
}

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
      const { name, roles } = req.body;
      const newRole = {
        roleList: roles['role-list'],
        roleCreate: roles['role-create'],
        roleEdit: roles['role-edit'],
        roleDelete: roles['role-delete'],
        ownerList: roles['owner-list'],
        ownerCreate: roles['owner-create'],
        ownerEdit: roles['owner-edit'],
        ownerDelete: roles['owner-delete'],
      };
      const updatedRole = await RolesRepo.updateRole(roleId, name, newRole);
      if (!updatedRole) {
        return badRequest(res, 'Role not found', []);
      }
  
      return successResponse(res, 'Role updated successfully', updatedRole, 200);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
    createRole,
    getAllRoles,
    deleteARole,
    updateRole
}