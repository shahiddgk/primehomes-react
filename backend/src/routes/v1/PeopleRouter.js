const express = require('express');
const router = express.Router();
const PeopleController = require('../../controllers/PeopleController');
const checkAuth = require('../../middlewares/checkAuth');
const checkPermission = require('../../middlewares/checkPermissions');


router.get('/', checkAuth, checkPermission(['owner-list', 'tenants-list']) , PeopleController.getAll)
router.get('/:type', checkAuth, checkPermission('people-by-type'), PeopleController.getAllByTypes)
router.post('/', checkAuth, checkPermission(['create-owner', 'create-tenants']), PeopleController.createPerson)
router.put('/:personID', checkAuth, checkPermission(['edit-owner', 'edit-tenants']), PeopleController.updatePerson)
router.delete('/:personID', checkAuth, checkPermission(['delete-owner', 'delete-tenants']), PeopleController.deletePerson)


module.exports = router