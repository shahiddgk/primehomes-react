const PeopleRepo = require('../repo/PeopleRepo')
const { badRequest, errorResponse, successResponse } = require('../config/responceHandler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

const getAll = async (req, res, next) => {
    try{
        const People = await PeopleRepo.getAll()
        successResponse(res, 'Getting All People', People, 200)
    }catch(err){
        next(err)
    }
}

const getUserRepresentatives = async(req, res, next) => {
    try{
        const People = await PeopleRepo.getAllRepresentatives()
        successResponse(res, 'Getting All People', People, 200)
    }catch(err){
        next(err)
    }
}
const getUserVisitors = async(req, res, next) => {
    try{
        const Visitors = await PeopleRepo.getAllVisitors()
        successResponse(res, 'Getting All Visitors', Visitors, 200)
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
         let User = await PeopleRepo.findOneByObject({primaryEmail: email})
         if(!User){
             return badRequest(res, 'User Not Found', [])
         }
         
         const isPasswordMatch =  bcrypt.compareSync(password, User.password);
         if(!isPasswordMatch){
             return badRequest(res, 'Password Does not Match!', [])
         }
         const userData =  {
             name: User.firstName + User.lastName,
             email: User.primaryEmail,
             type: User.type
         }
         const userInfo =  {
             name: User.firstName + User.lastName,
             email: User.primaryEmail,
             mobile: User.primaryMobile,

         }
         console.log("[PeopleConntroller:login] Logged in Successfully")
         const token = jwt.sign({User: User._id}, process.env.JWT_SECRET)
 
         successResponse(res, 'Login Successful.', {userData, token, userInfo})
    }catch(err){
      next(err)
    }
 }
 
 const updateProfile = async (req, res, next) => {   
    try{
        let {name, mobile, email} = req.body
        console.log(name, mobile, email);
        const {_id} = req.userData
        const nameWords = name.split(' ');

        let firstName = '';
        let middleName = '';
        let lastName = '';
        
        if (nameWords.length === 1) {
          firstName = nameWords[0];
        } else if (nameWords.length === 2) {
          firstName = nameWords[0];
          lastName = nameWords[1];
        } else {
          firstName = nameWords[0];
          lastName = nameWords[nameWords.length - 1];
          middleName = nameWords.slice(1, nameWords.length - 1).join(' ');
        }
        
        let User = await PeopleRepo.updateByObj(_id, {firstName, middleName, lastName, primaryMobile: mobile, primaryEmail: email})
        if (!User) {
            return badRequest(res, 'Something Went Wrong', [])
        }
        const io = req.app.get('io')
        const newName = User.firstName+User.middleName+User.lastName
       const newEmail = User.primaryEmail;
        const newMobile = User.primaryMobile
        io.to(_id).emit('updatedUser',[name = newName, mobile = newMobile, email = newEmail]);
        // io.emit('', )
        User = {
            fullName : User.firstName+User.middleName+User.lastName,
            email : User.primaryEmail,
            mobile : User.primaryMobile,
        }
        successResponse(res, 'Profile Updated Successfully.', User, 200)
    }catch(err){
        next(err)
    }
}


 const getSingleUser = async (req, res, next) => {
    try {
       const {email} = req.params;
       console.log(email);
       if (!email) {
        return console.log('Please Provide Email with Request');
       }
       let primaryEmail = '';
       const user = await PeopleRepo.findOneByObject({primaryEmail: email});
       if (!user) {
        return badRequest(res,'user Does Not Exist',[], 200)
       }
       
       return successResponse(res,'Getting user', user, 200)

    } catch (error) {
        next(error)
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
        const {type, code, title, firstName, lastName, middleName, primaryEmail, secondaryEmail, alternateEmail, landline, primaryMobile, secondaryMobile, isAuthorized, password} = req.body
        if(!(type && code && title && firstName && primaryEmail, password)){
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
        var salt = bcrypt.genSaltSync(10);
            var hashPass = bcrypt.hashSync(password, salt);
        const newPerson = await PeopleRepo.createPerson({type, code, title, firstName, lastName, middleName, primaryEmail, secondaryEmail, alternateEmail, landline, primaryMobile, secondaryMobile, isAuthorized, password: hashPass})
        if(!newPerson){
            return errorResponse(res, 'Issue Occured in Server', [], 502)
        }
        const token = jwt.sign({User: newPerson._id}, process.env.JWT_SECRET)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sohail.ratedsol@gmail.com',
                pass: 'sbbilwzjkcahrbqk'
            },
          });
          
          const sendWelcomeEmail = async (recipientEmail, recipientName, password) => {
            try {
              const mailOptions = {
                from: 'sohail.ratedsol@gmail.com', // Sender's email address
                to: recipientEmail, // Recipient's email address
                subject: 'Welcome to Our Platform', // Subject of the email
                html: `
                  <div>
                    <h2>Welcome, ${recipientName}!</h2>
                    <p>Your account has been created successfully.</p>
                    <p>Your login credentials are:</p>
                    <ul>
                      <li>Email: ${recipientEmail}</li>
                      <li>Password: ${password}</li>
                    </ul>
                    <p>Please keep your credentials secure.</p>
                    <p>Thank you for joining us!</p>
                  </div>
                `,
              };
          
              // Send the email
              await transporter.sendMail(mailOptions);
          
              console.log('Welcome email sent successfully.');
            } catch (error) {
              console.error('Error sending welcome email:', error);
            }
          };
          sendWelcomeEmail(primaryEmail, firstName, password);
        successResponse(res, 'Person Created Successfully', {newPerson, token}, 201)
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
    login,
    getSingleUser,
    updateProfile,
    getUserRepresentatives,
    getUserVisitors

}