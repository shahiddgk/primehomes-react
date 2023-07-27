const PeopleModel = require('../models/PeopleModel');
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

// find all registered user from people and user model

const findAllUsers =  async () => {
  const Users = await UserModel.aggregate([
    // Stage 1: Fetch all documents from the Users model
    {
      $match: { } // Empty match to fetch all documents
    },
    // Stage 2: Add a new field to identify the source collection (Users)
    {
      $addFields: {
        source: "Users"
      }
    },
    // Stage 3: Fetch all documents from the People model
    {
      $unionWith: {
        coll: "People",
        pipeline: [
          // Add a new field to identify the source collection (People)
          {
            $addFields: {
              source: "People"
            }
          }
        ]
      }
    }
  ]);
  return  Users 
}

const deleteUserById = async (userId) => {
  const deletedUser = await UserModel.findByIdAndDelete({_id:userId});
  if (deletedUser) {
    return deletedUser;
  } else {
    // If user not found in UserModel, try to delete from PeopleModel
    const deletedPerson = await PeopleModel.findByIdAndDelete({_id:userId});
    return deletedPerson;
  }
};


const findUserAndUpdate = async (userId, adminFlag, newData) => {
  try {
    // Find the user by ID and update the data
    if (adminFlag) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        {_id: userId },
        { $set: newData },
        { new: true } // Return the updated document
      );
      return updatedUser
    }
    const updatedUser = await PeopleModel.findByIdAndUpdate(
      {_id: userId },
      { $set: { firstName: newData.firstName, middleName: newData.middleName, lastName: newData.lastName, primaryEmail: newData.primaryEmail, type: newData.type } },
      { new: true } // Return the updated document
    );

    return updatedUser;
  } catch (error) {
    throw error;
  }
};






module.exports = {
    getAllUsers,
    createUser,
    findOneByObject,
    updateByObj,
    deleteById,
    updatedImage,
    findAllUsers,
    deleteUserById,
    findUserAndUpdate

}