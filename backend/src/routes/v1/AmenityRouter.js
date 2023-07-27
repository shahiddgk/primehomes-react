const express = require('express');
const router = express.Router();
const AmenityController = require('../../controllers/AmenityController');
const checkAuth = require('../../middlewares/checkAuth');


router.get('/', checkAuth, AmenityController.getAll)
router.post('/', checkAuth, AmenityController.createAmenity)
router.patch('/:amenityID', checkAuth, AmenityController.updateAmenity)
router.delete('/:amenityID', checkAuth, AmenityController.deleteAmenity)


module.exports = router