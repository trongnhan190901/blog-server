const Blog = require('../models/Blog');
const Draft = require('../models/Draft');
const { saveImageToS3, upload } = require('../middleware/uploadData');
const axios = require('axios');
const { JSDOM } = require('jsdom');

// Hàm xử lý request tạo bài viết blog
exports.createBlog = async (req, res) => {
    try {
        const { title, desc, content, author } = req.body;
        const newBlog = new Blog({ title, desc, content, author });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ message: 'Error creating blog post' });
    }
};

exports.draftBlog = async (req, res) => {
    try {
        const { title, desc, content, author } = req.body;
        const newDraftBlog = new Draft({ title, desc, content, author });
        await newDraftBlog.save();
        res.status(201).json(newDraftBlog);
    } catch (error) {
        res.status(500).json({ message: 'Error drafting blog post' });
    }
};

// Hàm xử lý request lấy danh sách bài viết blog
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'name');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts' });
    }
};

// Hàm xử lý request lấy thông tin bài viết blog theo ID
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate(
            'author',
            'name',
        );
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post' });
    }
};

exports.uploadImage = (req, res) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading image' });
        }

        try {
            const imageName = await saveImageToS3(req.file);
            const imageUrl = `https://myblogimg1909.s3.amazonaws.com/${imageName}`;
            console.log(imageUrl);
            res.json({
                success: 1,
                file: {
                    url: imageUrl,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error uploading image',
            });
        }
    });
};

exports.fetchImage = async (req, res) => {
    try {
        const { url } = req.body;

        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageData = Buffer.from(response.data, 'binary');

        const imageBase64 = imageData.toString('base64');

        const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

        res.json({
            success: 1,
            file: {
                url: imageUrl,
            },
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
        });
    }
};

exports.fetchLinkData = async (req, res) => {
    try {
        const linkUrl = req.query.url;

        const response = await axios.get(linkUrl);
        const html = response.data;

        const dom = new JSDOM(html);
        const document = dom.window.document;

        const title = document.querySelector('title').textContent;

        const description = document
            .querySelector('meta[name="description"]')
            .getAttribute('content');

        const image = document
            .querySelector('meta[property="og:image"]')
            .getAttribute('content');

        const meta = {
            title,
            description,
            image: {
                url: image,
            },
        };

        res.json({
            success: 1,
            link: linkUrl,
            meta,
        });
    } catch (error) {
        console.error('Error fetching link data:', error);
        res.status(500).json({ message: 'Error fetching link data' });
    }
};
