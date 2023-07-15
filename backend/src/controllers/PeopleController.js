const PeopleRepo = require('../repo/PeopleRepo')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler')


const getAll = async (req, res, next) => {
    try{
        const People = await PeopleRepo.getAll()
        successResponse(res, 'Getting All People', People, 200)
    }catch(err){
        next(err)
    }
}

const getAllByTypes = async (req, res, next) => {
    try{
        const {type} = req.params
        if(!(type === PeopleRepo.PeopleTypes.owner || type === PeopleRepo.PeopleTypes.tenant )){
            return badRequest(res, 'InCorrect Person Type!', [])
        }

        const People = await PeopleRepo.getAllByType(type)
        successResponse(res, `Getting All ${type}`, People, 200)
    }catch(err){
        next(err)
    }
}

const createPerson = async (req, res, next) => {
    try{
        const {type, code, title, firstName, lastName, middleName, primaryEmail, secondaryEmail, alternateEmail, landline, primaryMobile, secondaryMobile, isAuthorized} = req.body
        if(!(type && code && title && firstName && primaryEmail)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }

        if(!(type === PeopleRepo.PeopleTypes.owner || type === PeopleRepo.PeopleTypes.tenant )){
            return badRequest(res, 'InCorrect Person Type!', [])
        }
    
        // check already exists
        let Person = await PeopleRepo.findOneByObject({code})
        if(Person){
            return badRequest(res, 'Person is Already Exist with Same Code.', [], 403)
        }
        Person = await PeopleRepo.findOneByObject({primaryEmail})
        if(Person){
            return badRequest(res, 'Person is Already Exist with Same Email.', [], 403)
        }

        const newPerson = await PeopleRepo.createPerson({type, code, title, firstName, lastName, middleName, primaryEmail, secondaryEmail, alternateEmail, landline, primaryMobile, secondaryMobile, isAuthorized})
        if(!newPerson){
            return errorResponse(res, 'Issue Occured in Server', [], 502)
        }

        successResponse(res, 'Person Created Successfully', newPerson, 201)
    }catch(err){
        next(err)
    }
}

const updatePerson = async (req, res, next) => {
    try{
        const {personID} = req.params
        const isPerson = await PeopleRepo.findOneByObject({_id: personID})
        if(!isPerson){
            return badRequest(res, 'Person ID Does Not Match To Any Person!', [], 404)
        }

        const {type, code, title, firstName, lastName, middleName, primaryEmail, secondaryEmail, alternateEmail, landline, primaryMobile, secondaryMobile, isAuthorized} = req.body
        if(!(type && code && title && firstName && primaryEmail)){
            return badRequest(res, 'Please Provide the Required Data with Request!', [])
        }
    
         // check already exists
         let Person = await PeopleRepo.findOneByObject({code, _id: {$ne: personID}})
         if(Person){
             return badRequest(res, 'Person is Already Exist with Same Code.', [], 403)
         }
         Person = await PeopleRepo.findOneByObject({primaryEmail, _id: {$ne: personID}})
         if(Person){
             return badRequest(res, 'Person is Already Exist with Same Email.', [], 403)
         }
        
        const updatePerson = await PeopleRepo.updateByObj(personID, {type, code, title, firstName, lastName, middleName, primaryEmail, secondaryEmail, alternateEmail, landline, primaryMobile, secondaryMobile, isAuthorized})
        if(!updatePerson){
            return errorResponse(res, 'Issue Occured in Server', [], 502)
        }
        successResponse(res, 'Person Updated Successfully.', updatePerson, 201)
    }catch(err){
        next(err)
    }
}

const deletePerson = async (req, res, next) => {
    try{
        const {personID} = req.params
        const Person = await PeopleRepo.findOneByObject({_id: personID})
        if(!Person){
            return badRequest(res, 'Person ID Does Not Match To Any Person!', [], 404)
        }

        const deletedPerson = await PeopleRepo.deleteById(personID)
      
        successResponse(res, 'Person Deleted Successfully.', deletedPerson, 202)
    }catch(err){
        next(err)
    }
}


module.exports = {
    getAll,
    getAllByTypes,
    createPerson,
    updatePerson,
    deletePerson,


}