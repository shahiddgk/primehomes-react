const express = require('express');
const router = express.Router();
const checkAuth = require('../../middlewares/checkAuth');
const RolesController = require('../../controllers/RolesController');
const checkPermission = require('../../middlewares/checkPermissions');


router.post('/',  checkAuth, checkPermission('create-role'), RolesController.createRole)
router.get('/role',  checkAuth, checkPermission('role-list'), RolesController.getAllRoles)
router.get('/role/:name',  checkAuth, RolesController.getSingleRole)
router.delete('/role/:id',  checkAuth, checkPermission('delete-role'), RolesController.deleteARole)
router.patch('/role/:id',  checkAuth, checkPermission('edit-role'), RolesController.updateRole)
router.get('/permissions',  checkAuth , RolesController.getAllPermissions)

module.exports = router