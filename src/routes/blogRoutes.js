const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateSession = require('../middleware/authenticateSession');

router.post('/upload-image', blogController.uploadImage);

router.post('/fetch-image', blogController.fetchImage);

router.post('/submit', blogController.createBlog);

router.post('/draft', blogController.draftBlog);

router.post('/like/:slug', authenticateSession, blogController.likeBlog);

router.post('/save/:slug', authenticateSession, blogController.saveBlog);

router.put('/:slug', blogController.updateBlog);

router.delete('/:slug', blogController.deleteBlog);

router.get('/fetchUrl', blogController.fetchLinkData);

router.get('/:slug', blogController.getBlogBySlug);

router.get('/', blogController.getAllBlogs);

module.exports = router;
