const express = require('express');
const router = express.Router();
const AnoucementController = require('../../controllers/AnoucementController');
const checkAuth = require('../../middlewares/checkAuth');
const checkPermission = require('../../middlewares/checkPermissions');


router.get('/',  checkAuth, checkPermission('list-announcements'), AnoucementController.getAllAnnouncements)
router.post('/',  checkAuth, checkPermission('create-announcements'), AnoucementController.createAnnouncemnt)
router.patch('/:announcementID',  checkAuth, checkPermission('edit-announcements'), AnoucementController.updateAnnouncement)
router.delete('/:announcementID',  checkAuth, checkPermission('delete-announcements'), AnoucementController.deleteAnnouncement)


module.exports = router