const BuildingRepo = require('../repo/BuildingRepo')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler')


const getAll = async (req, res, next) => {
    try{
        const AllBuildings = await BuildingRepo.getAllBuildings()
        successResponse(res, 'Getting Buildings', AllBuildings, 200)
    }catch(err){
        next(err)
    }
}

const createBuilding = async (req, res, next) => {
    try{
        const {owner,code, name, phase, address, city, dues, dueDays} = req.body
        if(!(owner,code && name && phase && address)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
    
        // check already exists
        let Building = await BuildingRepo.findOneByObject({code})
        if(Building){
            return badRequest(res, 'Building is Already Exist with Same Code.', [], 403)
        }
        
        const newBuilding = await BuildingRepo.createBuilding({owner,code, name, phase, address, city, dues, dueDays})
        if(!newBuilding){
            return errorResponse(res, 'Issue Occured in Server', [], 502)
        }

        const AllBuildings = await BuildingRepo.getAllBuildings()

        successResponse(res, 'Building Created Successfully', AllBuildings, 201)
    }catch(err){
        next(err)
    }
}

const updateBuilding = async (req, res, next) => {
    try{
        const {buildingID} = req.params
        const isBuilding = await BuildingRepo.findOneByObject({_id: buildingID})
        if(!isBuilding){
            return badRequest(res, 'Building ID Does Not Match To Any Building!', [], 404)
        }

        const {code, name, phase, address, city, dues, dueDays} = req.body
        if(!(code && name && phase && address)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
    
        // check already exists
        let Building = await BuildingRepo.findOneByObject({code, _id: {$ne: isBuilding._id}})
        if(Building){
            return badRequest(res, 'Building is Already Exist with Same Code.', [], 403)
        }
        
        const updateBuilding = await BuildingRepo.updateByObj(isBuilding._id, {code, name, phase, address, city, dues, dueDays})
        if(!updateBuilding){
            return errorResponse(res, 'Issue Occured in Server', [], 502)
        }
        successResponse(res, 'Building Updated Successfully.', updateBuilding, 201)
    }catch(err){
        next(err)
    }
}

const deleteBuilding = async (req, res, next) => {
    try{
        const {buildingID} = req.params
        const isBuilding = await BuildingRepo.findOneByObject({_id: buildingID})
        if(!isBuilding){
            return badRequest(res, 'Building ID Does Not Match To Any Building!', [], 404)
        }

        const deletedBuilding = await BuildingRepo.deleteById(buildingID)
      
        successResponse(res, 'Building Deleted Successfully.', deletedBuilding, 202)
    }catch(err){
        next(err)
    }
}


module.exports = {
    getAll,
    createBuilding,
    updateBuilding,
    deleteBuilding,


}