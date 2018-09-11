const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const validation = require('./validation');
const helper = require('../auth/helpers');

router.get('/topics/:topicId/posts/new', postController.new);
router.post(
	'/topics/:topicId/posts/create',
	helper.ensureAuthenticated,
	validation.validatePosts,
	postController.create,
);
router.get('/topics/:topicId/posts/:id', postController.show);
router.post('/topics/:topicId/posts/:id/destroy', postController.destroy);
router.get('/topics/:topicId/posts/:id/edit', postController.edit);

router.post('/topics/:topicId/posts/:id/update', validation.validatePosts, postController.update);
// The middleware function chain above starts by making sure the user is authenticated, then validates the attributes coming in with the request, and finally calls the controller action.
module.exports = router;
