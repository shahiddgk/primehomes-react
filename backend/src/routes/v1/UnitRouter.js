const express = require('express');
const router = express.Router();
const UnitController = require('../../controllers/UnitController');
const checkAuth = require('../../middlewares/checkAuth');

router.get('/', checkAuth, UnitController.getAll)
router.post('/', checkAuth, UnitController.createUnit)
router.put('/:unitID', checkAuth, UnitController.updateUnit)
router.delete('/:unitID', checkAuth, UnitController.deleteUnit)
router.get('/list/:buildingID', checkAuth, UnitController.getUnitsPerBuilding)


module.exports = router