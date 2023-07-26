const RolesModel = require("../models/RolesModel")


const findName = async (name) => {
    return await RolesModel.findOne({name})
}

const createNewRole = async (name,roles) => {
    return await RolesModel.create({name,...roles})
}

const findAllRoles = async () => {
    return await RolesModel.find({})
}

const deleteRole = async (_id) => {
    return await RolesModel.findOneAndDelete({_id})
}


const updateRole = async (id, name, roles) => {
    try {
      return await RolesModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            ...roles
          }
        },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  };

module.exports = {
    findName,
    createNewRole,
    findAllRoles,
    deleteRole,
    updateRole
}