const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    slug: { type: String, required: true },
    content: { type: Object, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, required: true },
    approved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    saves: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            savedAt: { type: Date, default: Date.now },
        },
    ],
    views: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
