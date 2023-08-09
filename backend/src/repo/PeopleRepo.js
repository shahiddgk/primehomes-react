const PeopleModel = require('../models/PeopleModel')
const PeopleTypes = {
    owner: 'Owner',
    tenant: 'Tenant'
}


const getAll = async () => {
    return await PeopleModel.find({})
  };
const getAllRepresentatives = async () => {
    return await PeopleModel.find({}, 'firstName lastName representatives type').populate('representatives');
  };
  const getAllVisitors = async () => {
    return await PeopleModel.find(
      { visitors: { $exists: true, $not: { $size: 0 } } },
      'firstName lastName visitors type'
    ).populate('visitors');
  };
  

const getAllByType = async (type) => {
    return await PeopleModel.find({type})
};

const createPerson = async (obj) => {
    return await PeopleModel.create(obj)
  };

  const addOccupant = async (_id,occupantID) => {
    return await PeopleModel.findOneAndUpdate(
      {_id},
      {$push: {occupants: occupantID}},
      {new: true}
    )
  }
  const addVisitor = async (_id,visitorID) => {
    return await PeopleModel.findOneAndUpdate(
      {_id},
      {$push: {visitors: visitorID}},
      {new: true}
    )
  }

 const addRepresentative = async (_id,represnentativeId) => {
  return await PeopleModel.findOneAndUpdate(
    {_id},
    {$push: {representatives: represnentativeId}},
    {new: true}
  )
 }

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
    addOccupant,
    addRepresentative,
    getAllRepresentatives, 
    addVisitor,
    getAllVisitors


}