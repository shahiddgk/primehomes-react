const JWT = require('jsonwebtoken')
const { errorResponse } = require('../config/responceHandler')
const UserRepo = require('../repo/UserRepo')
const PeopleRepo = require('../repo/PeopleRepo')


const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = JWT.verify(token, process.env.JWT_SECRET)
    const [User, people] = await Promise.all([
      UserRepo.findOneByObject({ _id: decoded.User }),
      PeopleRepo.findOneByObject({ _id: decoded.User })
    ]);
    if((!User || User.active === false) && !people ){
      throw new Error;
    }
    req.userData = User || people
 
    // Injecting Socket
    // const io = req.app.get('io') // Socket
    // req.io = io 

    next()
  } catch (error) {
    return errorResponse(res, 'Authentication Failed!', [] ,401)
  }
}



module.exports = checkAuth
