const Blog = require('../models/Blog');

exports.getBlogsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const blogs = await Blog.find({ category: category }).populate(
            'author',
        );

        if (!blogs) {
            return res
                .status(404)
                .json({ message: 'No blogs found for this category' });
        }

        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blogs by category' });
    }
};
