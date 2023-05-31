const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/UserController');
const checkAuth = require('../../middlewares/checkAuth');


router.get('/dashboard', checkAuth, UserController.getDashboard)
router.post('/', UserController.createNewUser)
router.post('/login', UserController.login)
router.put('/profile', checkAuth, UserController.updateProfile)
router.patch('/password', checkAuth, UserController.changePassword)
router.delete('/profile', checkAuth, UserController.softDeleteUser)
router.delete('/permanent/:id', checkAuth, UserController.permanentDeleteUser)



module.exports = router