const express = require('express');
const router = express.Router();
const BuildingController = require('../../controllers/BuildingController');
const checkAuth = require('../../middlewares/checkAuth');
const checkPermission = require('../../middlewares/checkPermissions');

router.get('/',  checkAuth, checkPermission('list-buildings'), BuildingController.getAll)
router.post('/',  checkAuth, checkPermission('create-buildings'), BuildingController.createBuilding)
router.put('/:buildingID',  checkAuth, checkPermission('edit-buildings'), BuildingController.updateBuilding)
router.delete('/:buildingID',  checkAuth, checkPermission('delete-buildings'), BuildingController.deleteBuilding)


module.exports = router