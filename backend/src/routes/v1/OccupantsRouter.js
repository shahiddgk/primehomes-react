const express = require('express');
const router = express.Router();
const OccupantsController = require('../../controllers/OccupantsController')
const checkAuth = require('../../middlewares/checkAuth')

router.get('/', checkAuth, OccupantsController.getOccupants)
router.get('/unapprove', checkAuth, OccupantsController.getUnapprovedOccupants)
router.get('/occupant', checkAuth, OccupantsController.getOccupantsIdBased)
router.post('/', checkAuth, OccupantsController.createOccupants)
router.patch('/request/:occupantID', checkAuth, OccupantsController.updateOccupantRequests)
router.patch('/:occupantID', checkAuth, OccupantsController.updateOccupants)
router.delete('/:occupantID', checkAuth, OccupantsController.deleteOccupants)

module.exports = router