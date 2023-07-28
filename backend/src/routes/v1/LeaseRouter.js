const express = require('express');
const router = express.Router();
const LeaseController = require('../../controllers/LeaseController');
const checkAuth = require('../../middlewares/checkAuth');
const multer = require('multer')
const checkPermission = require('../../middlewares/checkPermissions');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }
  })
   
  var upload = multer({ storage })

router.get('/',  checkAuth, checkPermission('list-lease-profiling'), LeaseController.getAll)
router.post('/',  checkAuth, checkPermission('create-lease-profiling'), upload.any(), LeaseController.createLease)
router.put('/:leaseID',  checkAuth, checkPermission('edit-lease-profiling'), upload.any(), LeaseController.updateLease)
router.delete('/:leaseID',  checkAuth, checkPermission('delete-lease-profiling'), LeaseController.deleteLease)


module.exports = router


