const RepresentatorsRepo = require('../repo/RepresentatorsRepo')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler');
const cloudinary = require('cloudinary').v2;
const PeopleRepo = require('../repo/PeopleRepo')

cloudinary.config({ 
    cloud_name: 'dwf0svqiw', 
    api_key: '695943357591853', 
    api_secret: 'tX0GG4ca2J1h3fntFdHAI8iYLXo' 
  });

const getRepresentatives = async (req, res, next) => {
    try{
        const AllRepresentators = await RepresentatorsRepo.getAllRepresentators()
        successResponse(res, 'Fetched Representators', AllRepresentators, 200)
    }catch(err){
        next(err)
    }
}

const getRepresentativeIdBased = async (req, res, next) => {
    const {_id} = req.userData
    const representators = await RepresentatorsRepo.UserRepresentators(_id)
    if (!representators) {
        return badRequest(res, 'Something Went Wrong', [])
    }
    return successResponse(res, 'Fetched Representators', representators, 200)
}

const createRepresentators = async (req, res, next) => {
    try{
        const {_id} =  req.userData;
        const {name, email, mobile} = req.body
        const imageFile = req.files.image;
        if(!(name && email && mobile && req.files.image)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
    
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath);

        const newRepresentator = await RepresentatorsRepo.addRepresentator({name, email, mobile, image: result.secure_url, userId: _id})
        if(!newRepresentator){
            return errorResponse(res, 'Something Went Wrong', [], 502)
        }

        await PeopleRepo.addRepresentative(_id,newRepresentator._id)
        successResponse(res, 'Representator Created Successfully', newRepresentator, 201)
    }catch(err){
        next(err)
    }
}

const updateOccupantRequests = async (req, res, next) => {
    try{
        const {occupantID} = req.params
       
        const isOccupantExist= await RepresentatorsRepo.findOneByObject({_id: occupantID})
        if(!isOccupantExist){
            return badRequest(res, 'Occupant ID Does Not Match To Any Occupant!', [], 404)
        }
        const updatedOccupant = await RepresentatorsRepo.updateOccupant(isOccupantExist._id)
        if(!updatedOccupant){
            return errorResponse(res, 'Something Went wrong Please try again', [], 502)
        }
        successResponse(res, 'Occupant Updated Successfully.', updatedOccupant, 201)
    }catch(err){
        next(err)
    }
}
const updateRepresentators = async (req, res, next) => {
    try{
        const {representatorID} = req.params
        const {name, email, mobile} = req.body
        const imageFile = req.files.image;
        if(!(name && email && mobile && representatorID)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
        const isRepresentatorExist= await RepresentatorsRepo.findOneByObject({_id: representatorID})
        if(!isRepresentatorExist){
            return badRequest(res, 'Representator ID Does Not Match To Any Representator!', [], 404)
        }
        const result = await cloudinary.uploader.upload(imageFile.tempFilePath);
        const {_id} =  req.userData;
        const updatedRepresentator = await RepresentatorsRepo.updateByObj(isRepresentatorExist._id, {name, email, mobile, image: result.secure_url, userId: _id})
        if(!updatedRepresentator){
            return errorResponse(res, 'Something Went wrong Please try again', [], 502)
        }
        successResponse(res, 'Representator Updated Successfully.', updatedRepresentator, 201)
    }catch(err){
        next(err)
    }
}

const deleteRepresentators = async (req, res, next) => {
    try{
        const {representatorID} = req.params
        if (!representatorID) {
            return badRequest(res, 'Please Provide Required Data with Request', [])
        }
        const isRepresentatorExist = await RepresentatorsRepo.findOneByObject({_id: representatorID})
        if(!isRepresentatorExist){
            return badRequest(res, 'Representator ID Does Not Match To Any Representator!', [], 404)
        }
        const deletedRepresentator = await RepresentatorsRepo.deleteById(representatorID)
      
        successResponse(res, 'Representator Deleted Successfully.', deletedRepresentator, 202)
    }catch(err){
        next(err)
    }
}


module.exports = {
    getRepresentatives,
    createRepresentators,
    updateRepresentators,
    deleteRepresentators,
    updateOccupantRequests,
    getRepresentativeIdBased
}