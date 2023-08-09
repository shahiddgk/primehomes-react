const express = require('express');
const router = express.Router();
const RepresentativeController = require('../../controllers/RepresentativeController')
const checkAuth = require('../../middlewares/checkAuth')

router.get('/', checkAuth, RepresentativeController.getRepresentatives)
router.get('/represtators', checkAuth, RepresentativeController.getRepresentativeIdBased)
router.post('/', checkAuth, RepresentativeController.createRepresentators)
// router.patch('/request/:occupantID', checkAuth, RepresentativeController.updateOccupantRequests)
router.patch('/:representatorID', checkAuth, RepresentativeController.updateRepresentators)
router.delete('/:representatorID', checkAuth, RepresentativeController.deleteRepresentators)

module.exports = router