const RolesModel = require("../models/RolesModel")


const findName = async (name) => {
    return await RolesModel.findOne({name})
}

const createNewRole = async (name, permissions) => {
  return await RolesModel.create({ name, permissions});
};

const findAllRoles = async () => {
    return await RolesModel.find({})
}

const deleteRole = async (_id) => {
    return await RolesModel.findOneAndDelete({_id})
}


const updateRole = async (id, name, permissions) => {
    try {
      return await RolesModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            permissions
          }
        },
        { new: true }
      );
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  };

const findSingleRoles = async (name) => {
  return await RolesModel.findOne({name})
}


module.exports = {
    findName,
    createNewRole,
    findAllRoles,
    deleteRole,
    updateRole,
    findSingleRoles
}