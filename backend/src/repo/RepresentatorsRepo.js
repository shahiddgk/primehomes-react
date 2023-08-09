const RepresentatorsModel = require('../models/RepresentatorsModel')



const getAllRepresentators = async () => {
    return await RepresentatorsModel.find({})
  };


const addRepresentator = async (obj) => {
    return await RepresentatorsModel.create(obj)
  };

  const UserRepresentators = async (_id) => {
    return await RepresentatorsModel.find({userId:_id})
  }

const findOneByObject = async (obj) => {
  try{
    return await RepresentatorsModel.findOne(obj)
  }catch{
    return null
  }
  };


  const updateOccupant = async (_id) => {
    try {
      const updatedOccupant = await RepresentatorsModel.findOneAndUpdate(
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
    return await RepresentatorsModel.findOneAndUpdate({_id}, {$set: payload}, {new: true})
 };

 const deleteById = async (_id) => {
  return await RepresentatorsModel.findOneAndDelete({_id})
};




module.exports = {
    getAllRepresentators,
    addRepresentator,
    findOneByObject,
    updateByObj,
    deleteById,
    updateOccupant,
    UserRepresentators

}