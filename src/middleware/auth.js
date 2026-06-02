exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.role === 'Admin' || req.user.role === 'Staff')) {
        return next();
    }
    res.status(403).send('Access Denied: Admins only');
};

exports.isTrainer = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'Trainer') {
        return next();
    }
    res.status(403).send('Access Denied: Trainers only');
};
