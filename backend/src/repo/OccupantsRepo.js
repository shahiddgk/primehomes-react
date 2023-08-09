const OccupantsModel = require('../models/OccupantsModel')



const getAllOccupants = async () => {
    return await OccupantsModel.find({})
  };

  const UserOccupants = async (_id) => {
    return await OccupantsModel.find({userId:_id})
  }

const addOccupants = async (obj) => {
    return await OccupantsModel.create(obj)
  };


const findOneByObject = async (obj) => {
  try{
    return await OccupantsModel.findOne(obj)
  }catch{
    return null
  }
  };


  const updateOccupant = async (_id) => {
    try {
      const updatedOccupant = await OccupantsModel.findOneAndUpdate(
        { _id },
        { $set: { approved: true } },
        { new: true }
      );
      return updatedOccupant;
    } catch (error) {
      throw new Error('Error updating occupant: ' + error.message);
    }
  };
  

const updateByObj = async (_id, payload) => {
    return await OccupantsModel.findOneAndUpdate({_id}, {$set: payload}, {new: true})
 };

 const deleteById = async (_id) => {
  return await OccupantsModel.findOneAndDelete({_id})
};




module.exports = {
    getAllOccupants,
    addOccupants,
    findOneByObject,
    updateByObj,
    deleteById,
    updateOccupant,
    UserOccupants

}