const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: { type: String, maxlength: 500 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    tags: [{ type: String, trim: true }],
    published: { type: Boolean, default: false },
    featured:  { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    views: { type: Number, default: 0 },
    coverImage: { type: String, default: '' },
  },
  { timestamps: true }
);

// Auto-generate excerpt from content
BlogPostSchema.pre('save', function (next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 300).replace(/\s\S*$/, '') + '...';
  }
  next();
});

// Text index for search
BlogPostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', BlogPostSchema);
