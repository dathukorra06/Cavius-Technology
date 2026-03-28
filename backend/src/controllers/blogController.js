const BlogPost = require('../models/BlogPost');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responseHandler');

// GET /api/blogs
exports.getAllBlogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, tags, search, published } = req.query;
    const query = {};

    if (published !== undefined) query.published = published === 'true';
    if (category) query.category = { $regex: category, $options: 'i' };
    if (tags) query.tags = { $in: tags.split(',').map((t) => t.trim()) };
    if (search) query.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await BlogPost.countDocuments(query);
    const blogs = await BlogPost.find(query)
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    sendPaginated(res, 'Blogs retrieved', blogs, {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) { next(err); }
};

// GET /api/blogs/featured
exports.getFeaturedBlogs = async (req, res, next) => {
  try {
    const blogs = await BlogPost.find({ featured: true, published: true })
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 })
      .limit(6);
    sendSuccess(res, 'Featured blogs retrieved', blogs);
  } catch (err) { next(err); }
};

// GET /api/blogs/:id
exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('author', 'username firstName lastName avatar bio');

    if (!blog) return sendError(res, 'Blog not found', 404);
    sendSuccess(res, 'Blog retrieved', blog);
  } catch (err) { next(err); }
};

// GET /api/blogs/user/:userId
exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await BlogPost.find({ author: req.params.userId })
      .populate('author', 'username firstName lastName avatar')
      .sort({ createdAt: -1 });
    sendSuccess(res, 'User blogs retrieved', blogs);
  } catch (err) { next(err); }
};

// POST /api/blogs  [Protected]
exports.createBlog = async (req, res, next) => {
  try {
    const blog = await BlogPost.create({ ...req.body, author: req.user._id });
    await blog.populate('author', 'username firstName lastName avatar');
    sendSuccess(res, 'Blog created', blog, 201);
  } catch (err) { next(err); }
};

// PUT /api/blogs/:id  [Protected]
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await BlogPost.findById(req.params.id);
    if (!blog) return sendError(res, 'Blog not found', 404);
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to update this blog', 403);
    }
    blog = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate('author', 'username firstName lastName avatar');
    sendSuccess(res, 'Blog updated', blog);
  } catch (err) { next(err); }
};

// DELETE /api/blogs/:id  [Protected]
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return sendError(res, 'Blog not found', 404);
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to delete this blog', 403);
    }
    await blog.deleteOne();
    sendSuccess(res, 'Blog deleted');
  } catch (err) { next(err); }
};

// POST /api/blogs/:id/like  [Protected]
exports.toggleLike = async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return sendError(res, 'Blog not found', 404);

    const userId = req.user._id.toString();
    const liked = blog.likes.map((l) => l.toString()).includes(userId);

    if (liked) {
      blog.likes = blog.likes.filter((l) => l.toString() !== userId);
    } else {
      blog.likes.push(req.user._id);
    }
    await blog.save();
    sendSuccess(res, liked ? 'Blog unliked' : 'Blog liked', { likes: blog.likes.length });
  } catch (err) { next(err); }
};
