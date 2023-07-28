const express = require('express');
const router = express.Router();
const AmenityController = require('../../controllers/AmenityController');
const checkAuth = require('../../middlewares/checkAuth');
const checkPermission = require('../../middlewares/checkPermissions');


router.get('/',  checkAuth, checkPermission('list-amenities'), AmenityController.getAll)
router.post('/',  checkAuth, checkPermission('create-amenities'), AmenityController.createAmenity)
router.patch('/:amenityID',  checkAuth, checkPermission('edit-amenities'), AmenityController.updateAmenity)
router.delete('/:amenityID',  checkAuth, checkPermission('delete-amenities'), AmenityController.deleteAmenity)


module.exports = router