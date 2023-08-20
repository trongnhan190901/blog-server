const User = require('../models/User');
const Blog = require('../models/Blog');
const Draft = require('../models/Draft');

exports.getUserByGoogleId = async (req, res) => {
    try {
        const googleId = req.params.googleId;
        const user = await User.findOne({ googleId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = user._id;
        const blogs = await Blog.find({ author: userId }).sort({
            createdAt: -1,
        });

        const drafts = await Draft.find({ author: userId }).sort({
            createdAt: -1,
        });

        const savedBlogs = await Blog.find({
            'saves.user': userId,
        }).sort({
            'saves.savedAt': -1,
        });

        res.json({ user, blogs, savedBlogs, drafts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user and blogs' });
    }
};
