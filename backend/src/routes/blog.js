const express = require('express');
const router = express.Router();
const {
  getAllBlogs, getFeaturedBlogs, getBlogById, getUserBlogs,
  createBlog, updateBlog, deleteBlog, toggleLike,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { validateBlog } = require('../utils/validators');

router.get('/',             getAllBlogs);
router.get('/featured',     getFeaturedBlogs);
router.get('/user/:userId', getUserBlogs);
router.get('/:id',          getBlogById);
router.post('/',    protect, validateBlog, createBlog);
router.put('/:id',  protect, updateBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
