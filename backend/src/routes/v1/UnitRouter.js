const express = require('express');
const router = express.Router();
const UnitController = require('../../controllers/UnitController');
const checkAuth = require('../../middlewares/checkAuth');
const checkPermission = require('../../middlewares/checkPermissions');

router.get('/',  checkAuth, checkPermission('list-units'),UnitController.getAll)
router.post('/',  checkAuth, checkPermission('create-unit'), UnitController.createUnit)
router.put('/:unitID',  checkAuth, checkPermission('edit-unit'), UnitController.updateUnit)
router.delete('/:unitID',  checkAuth, checkPermission('delete-unit'), UnitController.deleteUnit)
router.get('/list/:buildingID',  checkAuth, checkPermission('list-units-per-building'), UnitController.getUnitsPerBuilding)


module.exports = router