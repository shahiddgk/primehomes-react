const OccupantsRepo = require('../repo/OccupantsRepo')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler');
const OccupantsModel = require('../models/OccupantsModel');
const cloudinary = require('cloudinary').v2;
const PeopleRepo = require('../repo/PeopleRepo')

cloudinary.config({ 
    cloud_name: 'dwf0svqiw', 
    api_key: '695943357591853', 
    api_secret: 'tX0GG4ca2J1h3fntFdHAI8iYLXo' 
  });

const getOccupants = async (req, res, next) => {
    try{
        const AllOccupants = await OccupantsRepo.getAllOccupants()
        successResponse(res, 'Fetched Occupants', AllOccupants, 200)
    }catch(err){
        next(err)
    }
}

const getUnapprovedOccupants = async (req, res, next) => {
    const occupants = await OccupantsModel.find({approved: false});
    if (!occupants) {
        return badRequest(res, 'Something Went wrong',[])
    }
    return successResponse(res, 'Occupents Fetched ', occupants, 200)
}

const getOccupantsIdBased = async (req, res, next) => {
    const {_id} = req.userData
    const occupants = await OccupantsRepo.UserOccupants(_id)
    if (!occupants) {
        return badRequest(res, 'Something Went Wrong', [])
    }
    return successResponse(res, 'Fetched occupants', occupants, 200)
}


const createOccupants = async (req, res, next) => {
    try{
        const {_id} =  req.userData;
        const {name, email, mobile} = req.body
        const imageFile = req.files.image;
        if(!(name && email && mobile && req.files.image)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
    
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath);

        const newOccupant = await OccupantsRepo.addOccupants({name, email, mobile, image: result.secure_url, userId: _id})
        if(!newOccupant){
            return errorResponse(res, 'Something Went Wrong', [], 502)
        }

        await PeopleRepo.addOccupant(_id,newOccupant._id)
        successResponse(res, 'Occupant Created Successfully', newOccupant, 201)
    }catch(err){
        next(err)
    }
}

const updateOccupantRequests = async (req, res, next) => {
    try{
        const {occupantID} = req.params
       
        const isOccupantExist= await OccupantsRepo.findOneByObject({_id: occupantID})
        if(!isOccupantExist){
            return badRequest(res, 'Occupant ID Does Not Match To Any Occupant!', [], 404)
        }
        const updatedOccupant = await OccupantsRepo.updateOccupant(isOccupantExist._id)
        if(!updatedOccupant){
            return errorResponse(res, 'Something Went wrong Please try again', [], 502)
        }
        successResponse(res, 'Occupant Updated Successfully.', updatedOccupant, 201)
    }catch(err){
        next(err)
    }
}
const updateOccupants = async (req, res, next) => {
    try{
        const {occupantID} = req.params
        const {name, email, mobile} = req.body
        const imageFile = req.files.image;
        if(!(name && email && mobile && occupantID)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
        const isOccupantExist= await OccupantsRepo.findOneByObject({_id: occupantID})
        if(!isOccupantExist){
            return badRequest(res, 'Occupant ID Does Not Match To Any Occupant!', [], 404)
        }
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath);
        const {_id} =  req.userData;
        const updatedOccupant = await OccupantsRepo.updateByObj(isOccupantExist._id, {name, email, mobile, image: result.secure_url, userId: _id})
        if(!updatedOccupant){
            return errorResponse(res, 'Something Went wrong Please try again', [], 502)
        }
        successResponse(res, 'Occupant Updated Successfully.', updatedOccupant, 201)
    }catch(err){
        next(err)
    }
}

const deleteOccupants = async (req, res, next) => {
    try{
        const {occupantID} = req.params
        if (!occupantID) {
            return badRequest(res, 'Please Provide Required Data with Request', [])
        }
        const isOccupantExist = await OccupantsRepo.findOneByObject({_id: occupantID})
        if(!isOccupantExist){
            return badRequest(res, 'Occupant ID Does Not Match To Any Occupant!', [], 404)
        }
        const deletedOccupant = await OccupantsRepo.deleteById(occupantID)
      
        successResponse(res, 'Occupant Deleted Successfully.', deletedOccupant, 202)
    }catch(err){
        next(err)
    }
}


module.exports = {
    getOccupants,
    createOccupants,
    updateOccupants,
    deleteOccupants,
    updateOccupantRequests,
    getUnapprovedOccupants,
    getOccupantsIdBased
}