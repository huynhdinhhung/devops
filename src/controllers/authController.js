const passport = require('passport');
const User = require('../models/User');
const Member = require('../models/Member');

// @desc    Show login form
// @route   GET /auth/login
exports.getLogin = (req, res) => {
    res.render('auth/login', { title: 'Login' });
};

// @desc    Handle login
// @route   POST /auth/login
exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/auth/login');

        req.logIn(user, (err) => {
            if (err) return next(err);
            
            // Redirect based on role
            if (user.role === 'Admin' || user.role === 'Staff') {
                return res.redirect('/admin');
            } else if (user.role === 'Trainer') {
                return res.redirect('/trainer/schedule');
            } else {
                return res.redirect('/profile');
            }
        });
    })(req, res, next);
};

// @desc    Logout user
// @route   GET /auth/logout
exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
};

// @desc    Show register form
// @route   GET /auth/register
exports.getRegister = (req, res) => {
    res.render('auth/register', { title: 'Register' });
};

// @desc    Handle registration
// @route   POST /auth/register
exports.postRegister = async (req, res) => {
    const { username, password, email, fullName } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.render('auth/register', { error: 'Email already exists' });
        }
        
        user = new User({ username, password, email, fullName });
        await user.save();

        // Create initial Member record
        await Member.create({ user: user._id });

        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
