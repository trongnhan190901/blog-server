const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.post('/submit', blogController.createBlog);

router.post('/draft', blogController.draftBlog);

router.post('/upload-image', blogController.uploadImage);

router.post('/fetch-image', blogController.fetchImage);

router.get('/', blogController.getAllBlogs);

router.get('/fetchUrl', blogController.fetchLinkData);

router.get('/:id', blogController.getBlogById);

module.exports = router;
