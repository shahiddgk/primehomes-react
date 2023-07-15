const LeaseModel = require('../models/LeaseModel')

const getAll = async () => {
    return await LeaseModel.find({}).populate([{path: 'building', model:'Buildings', select: {name:1, code:1}}, {path: 'tenant', model:'People', select: {code:1, title: 1, firstName: 1, middleName: 1, lastName: 1}}]).sort({updatedAt: -1})
  };


const createNew = async (obj) => {
    return await LeaseModel.create(obj)
  };


const findOneByObject = async (obj) => {
  try{
    return await LeaseModel.findOne(obj)
  }catch{
    return null
  }
  };

const updateByObj = async (_id, payload) => {
    return await LeaseModel.findOneAndUpdate({_id}, {$set: payload}, {new: true}).populate([{path: 'building', model:'Buildings', select: {name:1, code:1}}, {path: 'tenant', model:'People', select: {code:1, title: 1, firstName: 1, middleName: 1, lastName: 1}}])
 };

 const deleteById = async (_id) => {
  return await LeaseModel.findOneAndDelete({_id})
};




module.exports = {
    getAll,
    createNew,
    findOneByObject,
    updateByObj,
    deleteById,


}