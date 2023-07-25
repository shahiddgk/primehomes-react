const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');
const checkAuth = require('../../middlewares/checkAuth');


router.get('/', checkAuth, UserController.getAllUser)
router.get('/user/:email', UserController.getSingleUser)
router.get('/dashboard', checkAuth, UserController.getDashboard)
router.post('/',  UserController.createNewUser)
router.post('/upload',  UserController.changeProfilePicture)
router.post('/login', UserController.login)
router.put('/profile', checkAuth, UserController.updateProfile)
router.patch('/password', checkAuth, UserController.changePassword)
router.patch('/update/:id', checkAuth, UserController.updateUser)
router.delete('/profile', checkAuth, UserController.softDeleteUser)
router.delete('/user/:id', checkAuth, UserController.deleteUser)
router.delete('/permanent/:id', checkAuth, UserController.permanentDeleteUser)



module.exports = router