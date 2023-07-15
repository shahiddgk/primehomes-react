const UserModel = require('../models/UserModel')



const getAllUsers = async () => {
    return await UserModel.find({})
  };


const createUser = async (obj) => {
    return await UserModel.create(obj)
  };

  const updatedImage = async (email,imageUrl) => {
    console.log('email',email,imageUrl)
    return await UserModel.findOneAndUpdate(
      {email:email},
      {$set:{imageUrl}},
      {new: true}
    )
  }

const findOneByObject = async (obj) => {
  try{
    return await UserModel.findOne(obj)
  }catch{
    return null
  }
  };

const updateByObj = async (_id, payload) => {
    return await UserModel.findOneAndUpdate({_id}, {$set: payload}, {new: true})
 };

 const deleteById = async (_id) => {
  return await UserModel.findOneAndDelete({_id})
};




module.exports = {
    getAllUsers,
    createUser,
    findOneByObject,
    updateByObj,
    deleteById,
    updatedImage

}