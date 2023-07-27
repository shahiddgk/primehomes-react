const UserRepo = require('../repo/UserRepo')
const BuildingRepo = require('../repo/BuildingRepo')
const UnitsRepo = require('../repo/UnitsRepo')
const PeopleRepo = require('../repo/PeopleRepo')
const LeaseRepo = require('../repo/LeaseRepo')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler')
const cloudinary = require('cloudinary').v2



cloudinary.config({ 
    cloud_name: 'dwf0svqiw', 
    api_key: '695943357591853', 
    api_secret: 'tX0GG4ca2J1h3fntFdHAI8iYLXo' 
  });

const createNewUser = async (req, res, next) => {
    try{

        const {name, email, password, mobile, role} = req.body
        if(!(name && email && password && role)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
        // check already exists
        let User = await UserRepo.findOneByObject({email})
        if(User){
            return badRequest(res, 'User is Already Exists with Same Email.', [], 403)
        }
        // Testing Email Format
        const isEmail =  /(.+)@(.+){2,}\.(.+){2,}/.test(email)
        if(!isEmail){
            return badRequest(res, 'Email Should be Correct!', email)
        }

        var salt = bcrypt.genSaltSync(10);
            var hashPass = bcrypt.hashSync(password, salt);
            
            const newUser = await UserRepo.createUser({name, email, password: hashPass, mobile, role})
            if(!newUser){
                return errorResponse(res, 'Issue Occured in Server', [], 502)
            }
            const userData =  {
                name: newUser.name,
                email,
            }
    
            const token = jwt.sign({User: newUser._id}, process.env.JWT_SECRET)
    
            successResponse(res, 'User Created Successfully', {userData, token}, 201    )


    }catch(err){
        next(err)
    }
}

const changeProfilePicture = async (req, res, next) => {
  try {
      const {email} = req.body
      console.log(email);
      const file = req.files.avatar;
    if (!file) {
        return badRequest(res,'Please Provide the required Data',[])
    }

    cloudinary.uploader.upload(file.tempFilePath,async (err,result)=>{
        const imageUrl = result.url;
        const changeProfile = await UserRepo.updatedImage(email,imageUrl)
        console.log('check Profile',changeProfile);
        if (!changeProfile) {
            return badRequest(res, ' Something went wrong', [])
        }
        const io = req.app.get('io')
        io.emit('updatedProfile',changeProfile?.imageUrl)
        successResponse(res, 'Profile Updated Successfully', changeProfile,200)

    })

  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
   try{
        
        const {email, password} = req.body
        if(!(email && password)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }

        let User = await UserRepo.findOneByObject({email})
        if(!User){
            return badRequest(res, 'User Not Found', [])
        }
        if(!User.active){
            return badRequest(res, `User's Profile is Deleted Temporarily.`, [], 403)
        }
        
        const isPasswordMatch =  bcrypt.compareSync(password, User.password);
        if(!isPasswordMatch){
            return badRequest(res, 'Password Does not Match!', [])
        }
        
        const userData =  {
            name: User.name,
            email
        }
        const userInfo =  {
            name: User.name,
            email: User.email,
            mobile: User.mobile
        }

        console.log("[UserController:login] Logged in Successfully")
        const token = jwt.sign({User: User._id}, process.env.JWT_SECRET)

        successResponse(res, 'Login Successful.', {userData, token, userInfo})
   }catch(err){
     next(err)
   }
}

const updateProfile = async (req, res, next) => {   
    try{
        const {name, mobile, email} = req.body
        console.log(name, mobile, email);
        const {_id} = req.userData
      
        let User = await UserRepo.updateByObj(_id, {name, mobile, email})
        if (!User) {
            return badRequest(res, 'Something Went Wrong', [])
        }
        const io = req.app.get('io')
        io.emit('updatedUser', [User.name, User.mobile, User.email])
        User = {
            fullName : User.name,
            email : User.email,
            mobile : User.mobile,
        }
        successResponse(res, 'Profile Updated Successfully.', User, 200)
    }catch(err){
        next(err)
    }
}

const changePassword = async (req, res, next) => {
    try{
        const {oldPassword, newPassword} = req.body
        const {_id} = req.userData
        if(!(oldPassword && newPassword)){
            return badRequest(res, 'Please Provide the Required Data With the Request!', [])
        }

        const User = await UserRepo.findOneByObject({_id})
        if(!User){
            return badRequest(res, 'User Not Found!', [], 404)
        }

        const isPasswordMatch =  bcrypt.compareSync(oldPassword, User.password);
        if(!isPasswordMatch){
            return badRequest(res, 'Old Password Does not Match!', [], 405)
        }
        if(newPassword.length < 6){
            return badRequest(res, 'Password is too short! It must contain atleast 6 characters.', [])
        }

        var salt = bcrypt.genSaltSync(10);
        var hashPass = bcrypt.hashSync(newPassword, salt);
        const updatedUser = await UserRepo.updateByObj(_id, {password: hashPass})
        if(!updatedUser){
            return errorResponse(res, 'An Error Occured. Please Try Later.', [], 502)
        }


        return successResponse(res, 'Password Changed Successfully.', [], 202)

    }catch(err){
        next(err)
    }
}

const softDeleteUser = async (req, res, next) => {
    try{
        const {_id} = req.userData
        const User = await UserRepo.findOneByObject({_id})
        if(!User){
            return badRequest(res, 'User ID Does Not Match To Any User!', [], 404)
        }
        if(!User.active){
            return badRequest(res, 'User is Already Deleted.', [], 400)
        }

        await UserRepo.updateByObj(_id, {active: false})
        successResponse(res, 'User is Successfully Deleted.', [], 202)
    }catch(err){
        next(err)
    }
}

const permanentDeleteUser = async (req, res, next) => {
    try{
        const {id} = req.params
        const User = await UserRepo.findOneByObject({_id:id})
        if(!User){
            return badRequest(res, 'User ID Does Not Match To Any User!', [], 404)
        }
       
        const deletedUser = await UserRepo.deleteById(id)
        successResponse(res, 'User is Deleted Permanently.', deletedUser, 200)
    }catch(err){
        next(err)
    }
}

const getDashboard = async (req, res, next) => {
    try{
        
        const Buildings = await BuildingRepo.getAllBuildings()
        const Units = await UnitsRepo.getAll()
        const People = await PeopleRepo.getAll()
        const Lease = await LeaseRepo.getAll()

        successResponse(res, 'Getting Dashboard.', {
            Buildings,
            Units,
            People,
            Lease
        })

    }catch(err){
        next(err)
    }
}

// Get Single User

const getSingleUser = async (req, res, next) => {
    try {
       const {email} = req.params;
       console.log(email);
       if (!email) {
        return console.log('Please Provide Email with Request');
       }
       
       const user = await UserRepo.findOneByObject({email});
       if (!user) {
        return badRequest(res,'user Does Not Exist',[], 200)
       }
       
       return successResponse(res,'Getting user', user, 200)

    } catch (error) {
        next(error)
    }
}

// Get All Users

const getAllUser = async (req, res, next) => {
    const Users = await UserRepo.findAllUsers()
    if (!Users) {
        return badRequest(req, ' Something Went wrong', [])
    }
    successResponse(res, "Fetched Users", Users, 200)
}

// Delete a Users

const deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.id; 

      const deletedUser = await UserRepo.deleteUserById(userId);
  
      if (!deletedUser) {
        return badRequest(res, 'User not found', {}, 404);
      }
  
      successResponse(res, "User deleted successfully", deletedUser, 200);
    } catch (error) {
      console.error("Error deleting user:", error);
      return badRequest(res, "Server Error", 500);
    }
  };
  
// Update a User

  const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { adminFlag = false, ...userData } = req.body;
    try {
      let updatedUser;
      if (adminFlag) {
        updatedUser = await UserRepo.findUserAndUpdate(id, adminFlag, {
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
        if (!updatedUser) {
          return badRequest(res, 'User Not Found', [], 404);
        }
        return successResponse(res, 'User Updated Successfully', updatedUser, 200);
      }
  
      updatedUser = await UserRepo.findUserAndUpdate(id, adminFlag, {
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        primaryEmail: userData.primaryEmail,
        type: userData.type,
      });
      if (!updatedUser) {
        return badRequest(res, 'User Not Found', [], 404);
      }
      return successResponse(res, 'User Updated Successfully', updatedUser, 200);
    } catch (error) {
      next(error);
    }
  };
  

module.exports = {
    createNewUser,
    login,
    updateProfile,
    changePassword,
    softDeleteUser,
    permanentDeleteUser,
    getDashboard,
    getSingleUser,
    changeProfilePicture,
    getAllUser,
    deleteUser,
    updateUser
}