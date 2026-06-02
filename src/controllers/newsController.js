const Post = require('../models/Post');

// @desc    Show all blog posts
// @route   GET /news
exports.getNews = async (req, res) => {
    try {
        const posts = await Post.find({ isPublished: true }).populate('author').sort({ createdAt: -1 });
        res.render('news/index', { title: 'Gym News & Tips', posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Show single post
// @route   GET /news/:id
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author');
        if (!post) return res.redirect('/news');

        res.render('news/show', { title: post.title, post });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
