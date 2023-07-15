const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');
const checkAuth = require('../../middlewares/checkAuth');
// const multer = require('multer')
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         // console.log(file.filename);
//         // const image = URL.createObjectURL(file.filename);
//         // console.log('checkit=======',image);
//       cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
//     }
//   })
   
//   var upload = multer({ storage })


router.get('/user/:email', UserController.getSingleUser)
router.get('/dashboard', checkAuth, UserController.getDashboard)
router.post('/',  UserController.createNewUser)
router.post('/upload',  UserController.changeProfilePicture)
router.post('/login', UserController.login)
router.put('/profile', checkAuth, UserController.updateProfile)
router.patch('/password', checkAuth, UserController.changePassword)
router.delete('/profile', checkAuth, UserController.softDeleteUser)
router.delete('/permanent/:id', checkAuth, UserController.permanentDeleteUser)



module.exports = router