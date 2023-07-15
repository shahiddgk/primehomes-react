const JWT = require('jsonwebtoken')
const { errorResponse } = require('../config/responceHandler')
const UserRepo = require('../repo/UserRepo')


const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decoded = JWT.verify(token, process.env.JWT_SECRET)
    const User = await UserRepo.findOneByObject({_id: decoded.User})
    if(!User || User.active === false){
      throw new Error;
    }
    req.userData = User
 
    // Injecting Socket
    // const io = req.app.get('io') // Socket
    // req.io = io 

    next()
  } catch (error) {
    return errorResponse(res, 'Authentication Failed!', [] ,401)
  }
}

module.exports = checkAuth
