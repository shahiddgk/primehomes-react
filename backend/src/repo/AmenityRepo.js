const AmenityModel = require('../models/AmenityModel')



const getAllAmenties = async () => {
    return await AmenityModel.find({})
  };


const createAmenity = async (obj) => {
    return await AmenityModel.create(obj)
  };


const findOneByObject = async (obj) => {
  try{
    return await AmenityModel.findOne(obj)
  }catch{
    return null
  }
  };

const updateByObj = async (_id, payload) => {
    return await AmenityModel.findOneAndUpdate({_id}, {$set: payload}, {new: true})
 };

 const deleteById = async (_id) => {
  return await AmenityModel.findOneAndDelete({_id})
};




module.exports = {
    getAllAmenties,
    createAmenity,
    findOneByObject,
    updateByObj,
    deleteById,


}