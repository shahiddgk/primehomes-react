const BuildingModel = require('../models/BuildingModel')



const getAllBuildings = async () => {
    return await BuildingModel.find({})
  };


const createBuilding = async (obj) => {
    return await BuildingModel.create(obj)
  };


const findOneByObject = async (obj) => {
  try{
    return await BuildingModel.findOne(obj)
  }catch{
    return null
  }
  };

const updateByObj = async (_id, payload) => {
    return await BuildingModel.findOneAndUpdate({_id}, {$set: payload}, {new: true})
 };

 const deleteById = async (_id) => {
  return await BuildingModel.findOneAndDelete({_id})
};




module.exports = {
    getAllBuildings,
    createBuilding,
    findOneByObject,
    updateByObj,
    deleteById,


}