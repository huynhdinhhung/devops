const Post = require('../../models/Post');

// @desc    Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author').sort({ createdAt: -1 });
        res.render('admin/posts/index', { title: 'Manage News', posts, layout: 'admin/layout' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Show add post form
exports.getAddPost = (req, res) => {
    res.render('admin/posts/add', { title: 'Create Post', layout: 'admin/layout' });
};

// @desc    Add new post
exports.postAddPost = async (req, res) => {
    try {
        await Post.create({
            ...req.body,
            author: req.user._id
        });
        res.redirect('/admin/posts');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete post
exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/admin/posts');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
