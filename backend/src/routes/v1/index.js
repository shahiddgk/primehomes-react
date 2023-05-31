const express = require('express');
const router = express.Router();
const UserRouter = require('./UserRouter')
const BuildingRouter = require('./BuildingRouter')
const PeopleRouter = require('./PeopleRouter')
const UnitRouter = require('./UnitRouter')
const LeaseRouter = require('./LeaseRouter')

router.use('/users', UserRouter)
router.use('/buildings', BuildingRouter)
router.use('/people', PeopleRouter)
router.use('/units', UnitRouter)
router.use('/lease', LeaseRouter)


module.exports = router;
