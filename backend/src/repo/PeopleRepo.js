const PeopleModel = require('../models/PeopleModel')
const PeopleTypes = {
    owner: 'Owner',
    tenant: 'Tenant'
}


const getAll = async () => {
    return await PeopleModel.find({})
  };

const getAllByType = async (type) => {
    return await PeopleModel.find({type})
};

const createPerson = async (obj) => {
    return await PeopleModel.create(obj)
  };


const findOneByObject = async (obj) => {
  try{
    return await PeopleModel.findOne(obj)
  }catch{
    return null
  }
  };

const updateByObj = async (_id, payload) => {
    return await PeopleModel.findOneAndUpdate({_id}, {$set: payload}, {new: true})
 };

 const deleteById = async (_id) => {
  return await PeopleModel.findOneAndDelete({_id})
};


module.exports = {
    PeopleTypes,
    getAll,
    getAllByType,
    createPerson,
    findOneByObject,
    updateByObj,
    deleteById,


}