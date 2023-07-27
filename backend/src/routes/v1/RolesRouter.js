const express = require('express');
const router = express.Router();
const checkAuth = require('../../middlewares/checkAuth');
const RolesController = require('../../controllers/RolesController');


router.post('/',  checkAuth, RolesController.createRole)
router.get('/role',  checkAuth, RolesController.getAllRoles)
router.delete('/role/:id',  checkAuth, RolesController.deleteARole)
router.patch('/role/:id',  checkAuth, RolesController.updateRole)
router.get('/permissions',  checkAuth, RolesController.getAllPermissions)

module.exports = router