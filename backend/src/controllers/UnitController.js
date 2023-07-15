const UnitsRepo = require('../repo/UnitsRepo')
const PeopleRepo = require('../repo/PeopleRepo')
const BuildingRepo = require('../repo/BuildingRepo')
const { badRequest, successResponse } = require('../config/responceHandler')


const getAll = async (req, res, next) => {
    try{
        let AllUnits = await UnitsRepo.getAll()
        successResponse(res, 'Getting Units', AllUnits, 200)
    }catch(err){
        next(err)
    }
}

const createUnit = async (req, res, next) => {
    try{ 
        const {building, tenant, unitNo, unitType, floorArea, isParking, slotNo, parkingArea, parkingLocation, isFullyPaid, waterMeterNo } = req.body
       if(!(building && tenant && unitNo && unitType)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
        // check already exists
        let Unit = await UnitsRepo.findOneByObject({unitNo})
        if(Unit){
            return badRequest(res, 'Unit is Already exists with this Unit No!', [], 405)
        }
        let Building = await BuildingRepo.findOneByObject({_id: building})
        if(!Building){
            return badRequest(res, 'Building Not Found!', [], 404)
        }
        let User = await PeopleRepo.findOneByObject({_id: tenant})
        if(!User){
            return badRequest(res, 'User Not Found!', [], 404)
        }
        if(User.type !== PeopleRepo.PeopleTypes.tenant){
            return badRequest(res, 'User is Not Owner!', [], 403)
        }

        let newUnit = await UnitsRepo.createNew({...req.body})
        successResponse(res, 'Unit Created Successfully', newUnit, 201)
    }catch(err){
        next(err)
    }
}

const updateUnit = async (req, res, next) => {
    try{        
        const {unitID} = req.params
        const isUnit = await UnitsRepo.findOneByObject({_id: unitID})
        if(!isUnit){
            return badRequest(res, 'Unit ID Does Not Match To Any Unit!', [], 404)
        }

        const {building, owner, unitNo, unitType, floorArea, isParking, slotNo, parkingArea, parkingLocation, isFullyPaid, waterMeterNo } = req.body
        if(!(building && owner && unitNo && unitType)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
        // check already exists
        let Unit = await UnitsRepo.findOneByObject({unitNo, _id: {$ne: isUnit._id}})
        if(Unit){
            return badRequest(res, 'Unit is Already exists with this Unit No!', [], 405)
        }
        let Building = await BuildingRepo.findOneByObject({_id: building})
        if(!Building){
            return badRequest(res, 'Building Not Found!', [], 404)
        }
        let User = await PeopleRepo.findOneByObject({_id: owner})
        if(!User){
            return badRequest(res, 'User Not Found!', [], 404)
        }
        if(User.type !== PeopleRepo.PeopleTypes.owner){
            return badRequest(res, 'User is Not Owner!', [], 403)
        }

        const updatedUnit = await UnitsRepo.updateByObj(isUnit._id, {...req.body})
        successResponse(res, 'Unit Updated Successfully.', updatedUnit, 202)
    }catch(err){
        next(err)
    }
}

const deleteUnit = async (req, res, next) => {
    try{
        const {unitID} = req.params
        const isUnit = await UnitsRepo.findOneByObject({_id: unitID})
        if(!isUnit){
            return badRequest(res, 'Unit ID Does Not Match To Any Unit!', [], 404)
        }

        const deletedUnit = await UnitsRepo.deleteById(unitID)
        successResponse(res, 'Unit Deleted Successfully.', deletedUnit, 202)
    }catch(err){
        next(err)
    }
}

const getUnitsPerBuilding = async (req, res, next) => {
    try{
        const {buildingID} = req.params
        
        const isBuilding = await BuildingRepo.findOneByObject({_id: buildingID})
        if(!isBuilding){
            return badRequest(res, 'Building ID Does Not Match To Any Building!', [], 404)
        }

        const unitList = await UnitsRepo.getUnitListPerBuilding(buildingID)
        successResponse(res, `Getting Units List of '${isBuilding?.name}'`, unitList, 200)
    }catch(err){
        next(err)
    }
}


module.exports = {
    getAll,
    createUnit,
    updateUnit,
    deleteUnit,
    getUnitsPerBuilding,

}