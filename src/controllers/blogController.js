const { saveImageToS3, upload } = require('../middleware/uploadData');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');
const shortid = require('shortid');
const { mergeComments } = require('../helpers/blogHelper');

exports.createBlog = async (req, res) => {
    try {
        const { title, desc, content, category, author } = req.body;
        const slug = shortid.generate(title);

        const newBlog = new Blog({
            title,
            desc,
            content,
            category,
            author,
            slug,
        });

        await newBlog.save();

        return res.status(201).json({ slug });
    } catch (error) {
        console.error('Error creating blog:', error);
        return res.status(500).json({ message: 'Error creating blog post' });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.session.user.id;

        const blog = await Blog.findOneAndUpdate(
            { _id: blogId, author: userId },
            {
                $set: {
                    title: req.body.title,
                    desc: req.body.desc,
                    content: req.body.content,
                    category: req.body.category,
                    updatedAt: new Date(),
                },
            },
            { new: true },
        );

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Error updating blog' });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.session.user.id;

        const blog = await Blog.findOneAndDelete({
            _id: blogId,
            author: userId,
        });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog' });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate({
                path: 'author',
                select: 'name avatar',
            })
            .sort({ createdAt: -1 });

        const userIsLoggedIn = !!req.session.user;

        const updatedBlogs = blogs.map((blog) => {
            const hasLiked =
                userIsLoggedIn && blog.likes.includes(req.session.user.id);
            const hasSaved =
                userIsLoggedIn &&
                blog.saves.some((save) =>
                    save.user.equals(req.session.user.id),
                );

            return {
                ...blog.toObject(),
                userHasLiked: hasLiked,
                userHasSaved: hasSaved,
            };
        });

        res.json(updatedBlogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog posts' });
    }
};

exports.getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const userId = req.session.user ? req.session.user.id : null;

        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        blog.views++;
        await blog.save();

        const author = await User.findById(blog.author._id, 'name avatar');

        const hasLiked = userId && blog.likes.includes(userId);
        const hasSaved = userId && blog.saves.user.includes(userId);

        res.json({
            ...blog.toObject(),
            author,
            userHasLiked: hasLiked,
            userHasSaved: hasSaved,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blog post' });
    }
};

exports.likeBlog = async (req, res) => {
    const slug = req.params.slug;
    const userId = req.session.user.id;

    try {
        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        if (blog.likes.includes(userId)) {
            // User has already liked the blog, so remove the like
            blog.likes.pull(userId);
        } else {
            // User hasn't liked the blog, so add the like
            blog.likes.push(userId);
        }

        await blog.save();

        res.json({ success: true, likes: blog.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Error liking blog' });
    }
};

exports.saveBlog = async (req, res) => {
    const slug = req.params.slug;
    const userId = req.session.user.id;

    try {
        const blog = await Blog.findOne({ slug });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const userIndex = blog.saves.findIndex((save) =>
            save.user.equals(userId),
        );

        if (userIndex !== -1) {
            // User has already saved the blog, so remove the save
            blog.saves.splice(userIndex, 1);
        } else {
            // User hasn't saved the blog, so add the save
            blog.saves.push({ user: userId });
        }

        await blog.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error saving blog' });
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

exports.searchBlogs = async (req, res) => {
    try {
        const { search } = req.body;

        const blogs = await Blog.find({
            title: { $regex: search, $options: 'i' },
        })
            .populate({
                path: 'author',
                select: 'name avatar',
            })
            .sort({ createdAt: -1 });

        const users = await User.find({
            name: { $regex: search, $options: 'i' },
        });

        const userIsLoggedIn = !!req.session.user;

        const updatedBlogs = blogs.map((blog) => {
            const hasLiked =
                userIsLoggedIn && blog.likes.includes(req.session.user.id);
            const hasSaved =
                userIsLoggedIn &&
                blog.saves.some((save) =>
                    save.user.equals(req.session.user.id),
                );

            return {
                ...blog.toObject(),
                userHasLiked: hasLiked,
                userHasSaved: hasSaved,
            };
        });

        res.json({
            blogs: updatedBlogs,
            users: users,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching blogs' });
    }
};

// exports.createComment = async (req, res) => {
//     try {
//         const { content, author } = req.body;

//         const newComment = new Comment({
//             content,
//             author,
//             type: 'comment',
//         });

//         await newComment.save();

//         res.status(201).json(newComment);
//     } catch (error) {
//         console.error('Error creating comment:', error);
//         res.status(500).json({ error: 'Something went wrong.' });
//     }
// };

// exports.createReply = async (req, res) => {
//     try {
//         const { content, parent } = req.body;
//         const author = req.session.user.id;

//         const parentComment = await Comment.findById(parent);

//         if (!parentComment) {
//             return res
//                 .status(404)
//                 .json({ message: 'Parent comment not found' });
//         }

//         const level = parentComment.level + 1;

//         const newReply = new Comment({
//             content,
//             author,
//             parent: parentComment._id,
//             level,
//             type: 'reply',
//         });

//         await newReply.save();

//         parentComment.replies.push(newReply._id);

//         await parentComment.save();

//         res.status(201).json(newReply);
//     } catch (error) {
//         console.error('Error creating reply:', error);
//         res.status(500).json({ error: 'Something went wrong.' });
//     }
// };

// exports.fetchComments = async (req, res) => {
//     try {
//         const { slug } = req.params;

//         const blog = await Blog.findOne({ slug });

//         if (!blog) {
//             return res.status(404).json({ message: 'Blog not found' });
//         }

//         const comments = await Comment.find({ parentBlog: blog._id });

//         const populateReplies = async (comment) => {
//             if (comment.replies && comment.replies.length > 0) {
//                 const populatedReplies = await Promise.all(
//                     comment.replies.map(async (replyId) => {
//                         const replyComment = await Comment.findById(replyId);
//                         if (replyComment) {
//                             replyComment.replies = await populateReplies(
//                                 replyComment,
//                             );
//                         }
//                         return replyComment;
//                     }),
//                 );
//                 comment.replies = populatedReplies;
//             }
//             return comment;
//         };

//         const populatedComments = await Promise.all(
//             comments.map(async (comment) => {
//                 const populatedComment = await populateReplies(comment);
//                 return populatedComment;
//             }),
//         );

//         const mergedComments = mergeComments(populatedComments);

//         return res.json(mergedComments);
//     } catch (error) {
//         console.error('Error fetching comments:', error);
//         return res.status(500).json({ message: 'Error fetching comments' });
//     }
// };
