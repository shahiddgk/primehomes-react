const express = require('express');
const router = express.Router();
const PeopleController = require('../../controllers/PeopleController');
const checkAuth = require('../../middlewares/checkAuth');


router.get('/', checkAuth, PeopleController.getAll)
router.get('/:type', checkAuth, PeopleController.getAllByTypes)
router.post('/', checkAuth, PeopleController.createPerson)
router.put('/:personID', checkAuth, PeopleController.updatePerson)
router.delete('/:personID', checkAuth, PeopleController.deletePerson)


module.exports = router