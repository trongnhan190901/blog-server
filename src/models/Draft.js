const mongoose = require('mongoose');

const blogDraftSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    content: { type: Object, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const Draft = mongoose.model('Draft', blogDraftSchema);

module.exports = Draft;
