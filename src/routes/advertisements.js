const express = require('express');
const router = express.Router();
const validation = require('./validation');
const advertisementController = require('../controllers/advertisementController');
const helper = require('../auth/helpers');

router.get('/advertisements', advertisementController.index);
router.get('/advertisements/new', advertisementController.new);
router.post('/advertisements/create', helper.ensureAuthenticated, validation.validateTopics, advertisementController.create);
router.get('/advertisements/:id', advertisementController.show);
router.post('/advertisements/:id/destroy', advertisementController.destroy);
router.get('/advertisements/:id/edit', advertisementController.edit);
router.post('/advertisements/:id/update', advertisementController.update);

module.exports = router;
