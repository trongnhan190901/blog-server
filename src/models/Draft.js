const mongoose = require('mongoose');

const blogDraftSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    content: { type: Array, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const draftBlog = mongoose.model('Draft', blogDraftSchema);

module.exports = draftBlog;
