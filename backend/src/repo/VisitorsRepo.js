const VisitorsModel = require('../models/VisitorsModel')



const getAllVisitors = async () => {
    return await VisitorsModel.find({active:true})
  };
const getVisitors = async () => {
    return await VisitorsModel.find({active:true, status: 'approved'})
};


const addVisitors = async (obj) => {
    return await VisitorsModel.create(obj)
  };


const findOneByObject = async (obj) => {
  try{
    return await VisitorsModel.findOne(obj)
  }catch{
    return null
  }
  };



const updateByObj = async (_id, payload) => {
    return await VisitorsModel.findOneAndUpdate({_id}, {$set: payload}, {new: true})
 };
const updateStatus = async (_id, payload) => {
    return await VisitorsModel.findOneAndUpdate({_id}, {$set: {status: payload}}, {new: true})
 };

 const softDeleteById = async (_id) => {
  return await VisitorsModel.findOneAndUpdate({_id},{$set: {active:false}},{new: true})
};




module.exports = {
  getAllVisitors,
    addVisitors,
    findOneByObject,
    updateByObj,
    softDeleteById,
    updateStatus,
    getVisitors
}