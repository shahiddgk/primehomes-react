const LeaseRepo = require('../repo/LeaseRepo')
const PeopleRepo = require('../repo/PeopleRepo')
const BuildingRepo = require('../repo/BuildingRepo')
const { badRequest, successResponse } = require('../config/responceHandler')


const getAll = async (req, res, next) => {
    try{
        let AllLeases = await LeaseRepo.getAll()
        successResponse(res, 'Getting All Lease Properties', AllLeases, 200)
    }catch(err){
        next(err)
    }
}

const createLease = async (req, res, next) => {
    try{ 
        const {startDate, endDate, building, unit, leaseType, tenant, accuntStatus, amenities, leaseContract, identity, otherDoc1, otherDoc2, personalDetails } = req.body
        if(!(startDate && endDate && building && leaseType && tenant)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }

        // check already exists
        let Building = await BuildingRepo.findOneByObject({_id: building})
        if(!Building){
            return badRequest(res, 'Building Not Found!', [], 404)
        }
        let User = await PeopleRepo.findOneByObject({_id: tenant})
        if(!User){
            return badRequest(res, 'User Not Found!', [], 404)
        }
        if(User.type !== PeopleRepo.PeopleTypes.tenant){
            return badRequest(res, 'User is Not Tenant!', [], 403)
        }

        const leaseContractImg = req.files.filter(x => x.fieldname === 'leaseContract')[0]
        const identityImg = req.files.filter(x => x.fieldname === 'identity')[0]
        const otherDoc1Img = req.files.filter(x => x.fieldname === 'otherDoc1')[0]
        const otherDoc2Img = req.files.filter(x => x.fieldname === 'otherDoc2')[0]
   
        let newUnit = await LeaseRepo.createNew({
            ...req.body,
            identity: identityImg,
            leaseContract: leaseContractImg,
            otherDoc1: otherDoc1Img,
            otherDoc2: otherDoc2Img
        })
        successResponse(res, 'Lease Created Successfully', newUnit, 201)
    }catch(err){
        next(err)
    }
}

const updateLease = async (req, res, next) => {
    try{        
        const {leaseID} = req.params
        const isLease = await LeaseRepo.findOneByObject({_id: leaseID})
        if(!isLease){
            return badRequest(res, 'Lease ID Does Not Match To Any Lease!', [], 404)
        }

        const {startDate, endDate, building, unit, leaseType, tenant, accuntStatus, amenities, leaseContract, identity, otherDoc1, otherDoc2, personalDetails } = req.body
        if(!(startDate && endDate && building && leaseType && tenant)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
        
        // check already exists
        let Building = await BuildingRepo.findOneByObject({_id: building})
        if(!Building){
            return badRequest(res, 'Building Not Found!', [], 404)
        }
        let User = await PeopleRepo.findOneByObject({_id: tenant})
        if(!User){
            return badRequest(res, 'User Not Found!', [], 404)
        }
        if(User.type !== PeopleRepo.PeopleTypes.tenant){
            return badRequest(res, 'User is Not Tenant!', [], 403)
        }

        const leaseContractImg = req?.files?.filter(x => x.fieldname === 'leaseContract')[0]
        const identityImg = req?.files?.filter(x => x.fieldname === 'identity')[0]
        const otherDoc1Img = req?.files?.filter(x => x.fieldname === 'otherDoc1')[0]
        const otherDoc2Img = req?.files?.filter(x => x.fieldname === 'otherDoc2')[0]

        console.log(leaseContractImg, identityImg, otherDoc1Img, otherDoc2Img);

        const updateLease = await LeaseRepo.updateByObj(isLease._id, {
            ...req.body,
            identity: identityImg ?? isLease.identity ,
            leaseContract: leaseContractImg ?? isLease.leaseContract ,
            otherDoc1: otherDoc1Img ?? isLease.otherDoc1 ,
            otherDoc2: otherDoc2Img ?? isLease.otherDoc2
        })
        successResponse(res, 'Lease Updated Successfully.', updateLease, 202)
    }catch(err){
        next(err)
    }
}

const deleteLease = async (req, res, next) => {
    try{
        const {leaseID} = req.params
        const isLease = await LeaseRepo.findOneByObject({_id: leaseID})
        if(!isLease){
            return badRequest(res, 'Lease ID Does Not Match To Any Lease!', [], 404)
        }

        const deletedLease = await LeaseRepo.deleteById(leaseID)
        successResponse(res, 'Lease Deleted Successfully.', deletedLease, 202)
    }catch(err){
        next(err)
    }
}


module.exports = {
    getAll,
    createLease,
    updateLease,
    deleteLease,


}