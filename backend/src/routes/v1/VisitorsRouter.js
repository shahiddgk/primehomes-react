const express = require('express');
const router = express.Router();
const VisitorsController = require('../../controllers/VisitorsController')
const checkAuth = require('../../middlewares/checkAuth')

router.get('/', checkAuth, VisitorsController.getVisitors)
router.get('/cards', checkAuth, VisitorsController.getVisitorCards)
// router.get('/unapprove', checkAuth, VisitorsController.getUnapprovedOccupants)
// router.get('/occupant', checkAuth, VisitorsController.getOccupantsIdBased)
router.post('/', checkAuth, VisitorsController.createVisitor)
router.patch('/status/:visitorID', checkAuth, VisitorsController.updateVisitorStatus)
router.patch('/:visitorID', checkAuth, VisitorsController.updateVisitors)
router.patch('/visitor/:visitorID', checkAuth, VisitorsController.softDeleteVisitor)

module.exports = router