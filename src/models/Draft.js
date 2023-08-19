const mongoose = require('mongoose');

const blogDraftSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    desc: { type: String },
    content: { type: Array, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const draftBlog = mongoose.model('Draft', blogDraftSchema);

module.exports = draftBlog;
