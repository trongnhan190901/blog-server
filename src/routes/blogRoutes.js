const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateSession = require('../middleware/authenticateSession');

router.get('/:slug', blogController.getBlogBySlug);

// router.get('/:slug/comments', blogController.fetchComments);

router.get('/fetchUrl', blogController.fetchLinkData);

router.get('/', blogController.getAllBlogs);

router.post('/search', blogController.searchBlogs);

router.post('/upload-image', blogController.uploadImage);

router.post('/fetch-image', blogController.fetchImage);

router.post('/submit', blogController.createBlog);

router.post('/like/:slug', authenticateSession, blogController.likeBlog);

router.post('/save/:slug', authenticateSession, blogController.saveBlog);

// router.post(
//     '/:slug/comment',
//     authenticateSession,
//     blogController.createComment,
// );

// router.post('/reply', authenticateSession, blogController.createReply);

router.put('/:slug/update', blogController.updateBlog);

router.delete('/:slug/delete', blogController.deleteBlog);

module.exports = router;
