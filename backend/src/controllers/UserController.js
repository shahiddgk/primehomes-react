const UserRepo = require('../repo/UserRepo')
const BuildingRepo = require('../repo/BuildingRepo')
const UnitsRepo = require('../repo/UnitsRepo')
const PeopleRepo = require('../repo/PeopleRepo')
const LeaseRepo = require('../repo/LeaseRepo')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler')

const createNewUser = async (req, res, next) => {
    try{
        const {name, email, password, mobile, role} = req.body
        if(!(name && email && password && role)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
    
        // Testing Email Format
        const isEmail =  /(.+)@(.+){2,}\.(.+){2,}/.test(email)
        if(!isEmail){
            return badRequest(res, 'Email Should be Correct!', email)
        }

        // check already exists
        let User = await UserRepo.findOneByObject({email})
        if(User){
            return badRequest(res, 'User is Already Exists with Same Email.', [], 403)
        }
      

        // Encrypting Password
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

        console.log("[UserController:login] Logged in Successfully")
        const token = jwt.sign({User: User._id}, process.env.JWT_SECRET)

        successResponse(res, 'Login Successful.', {userData, token})
   }catch(err){
     next(err)
   }
}

const updateProfile = async (req, res, next) => {   
    try{
        const {name, mobile} = req.body
        const {_id} = req.userData
      
        await UserRepo.updateByObj(_id, {name, mobile})
        successResponse(res, 'Profile Updated Successfully.', [], 200)
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







module.exports = {
    createNewUser,
    login,
    updateProfile,
    changePassword,
    softDeleteUser,
    permanentDeleteUser,
    getDashboard,



}