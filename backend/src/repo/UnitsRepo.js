const UnitesModel = require('../models/UnitesModel')



const getAll = async () => {
    return await UnitesModel.find({}).populate([{path: 'building', model:'Buildings', select: {name:1, code:1}}, {path: 'tenant', model:'People', select: {code:1, title: 1, firstName: 1, middleName: 1, lastName: 1}}]).sort({updatedAt: -1})
  };


const createNew = async (obj) => {
    return await UnitesModel.create(obj)
  };


const findOneByObject = async (obj) => {
  try{
    return await UnitesModel.findOne(obj)
  }catch{
    return null
  }
  };

const updateByObj = async (_id, payload) => {
    return await UnitesModel.findOneAndUpdate({_id}, {$set: payload}, {new: true})
 };

 const deleteById = async (_id) => {
  return await UnitesModel.findOneAndDelete({_id})
};

const getUnitListPerBuilding = async (building) => {
  try{
     return await UnitesModel.find({building},{unitNo: 1}).sort({updatedAt: -1})
  }catch{
    return null
  }
};





module.exports = {
    getAll,
    createNew,
    findOneByObject,
    updateByObj,
    deleteById,
    getUnitListPerBuilding,


}