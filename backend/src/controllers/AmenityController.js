const AmenityRepo = require('../repo/AmenityRepo')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler')


const getAll = async (req, res, next) => {
    try{
        const AllAmenities = await AmenityRepo.getAllAmenties()
        successResponse(res, 'Getting Amenities', AllAmenities, 200)
    }catch(err){
        next(err)
    }
}

const createAmenity = async (req, res, next) => {
    try{
        const {name, dues, charges} = req.body
        if(!(name && dues && charges)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
    
            
        const newAmenity = await AmenityRepo.createAmenity({name, dues, charges})
        if(!newAmenity){
            return errorResponse(res, 'Issue Occured in Server', [], 502)
        }

        const AllAmenities = await AmenityRepo.getAllAmenties()

        successResponse(res, 'Amenity Created Successfully', AllAmenities, 201)
    }catch(err){
        next(err)
    }
}

const updateAmenity = async (req, res, next) => {
    try{
        const {amenityID} = req.params
        const isAmenity= await AmenityRepo.findOneByObject({_id: amenityID})
        if(!isAmenity){
            return badRequest(res, 'Amenity ID Does Not Match To Any Amenity!', [], 404)
        }

        const {name, dues, charges} = req.body
        if(!(name && dues && charges)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
    
        const updatedAmenity = await AmenityRepo.updateByObj(isAmenity._id, {name, dues, charges})
        if(!updatedAmenity){
            return errorResponse(res, 'Issue Occured in Server', [], 502)
        }
        successResponse(res, 'Amenity Updated Successfully.', updatedAmenity, 201)
    }catch(err){
        next(err)
    }
}

const deleteAmenity = async (req, res, next) => {
    try{
        const {amenityID} = req.params
        const isAmenity = await AmenityRepo.findOneByObject({_id: amenityID})
        if(!isAmenity){
            return badRequest(res, 'Amenity ID Does Not Match To Any Amenity!', [], 404)
        }

        const deletedAmenity = await AmenityRepo.deleteById(amenityID)
      
        successResponse(res, 'Amenity Deleted Successfully.', deletedAmenity, 202)
    }catch(err){
        next(err)
    }
}


module.exports = {
    getAll,
    createAmenity,
    updateAmenity,
    deleteAmenity,
}