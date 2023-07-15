const express = require('express');
const router = express.Router();
const LeaseController = require('../../controllers/LeaseController');
const checkAuth = require('../../middlewares/checkAuth');
const multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
  })
   
  var upload = multer({ storage })

router.get('/', checkAuth, LeaseController.getAll)
router.post('/', checkAuth, upload.any(), LeaseController.createLease)
router.put('/:leaseID', checkAuth, upload.any(), LeaseController.updateLease)
router.delete('/:leaseID', checkAuth, LeaseController.deleteLease)


module.exports = router


