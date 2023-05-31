const express = require('express');
const router = express.Router();
const BuildingController = require('../../controllers/BuildingController');
const checkAuth = require('../../middlewares/checkAuth');


router.get('/', checkAuth, BuildingController.getAll)
router.post('/', checkAuth, BuildingController.createBuilding)
router.put('/:buildingID', checkAuth, BuildingController.updateBuilding)
router.delete('/:buildingID', checkAuth, BuildingController.deleteBuilding)


module.exports = router