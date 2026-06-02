const Package = require('../../models/Package');

// @desc    Get all packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find().sort({ createdAt: -1 });
        res.render('admin/packages/index', { title: 'Manage Packages', packages, layout: 'admin/layout' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Show add package form
exports.getAddPackage = (req, res) => {
    res.render('admin/packages/add', { title: 'Add New Package', layout: 'admin/layout' });
};

// @desc    Add new package
exports.postAddPackage = async (req, res) => {
    try {
        await Package.create(req.body);
        res.redirect('/admin/packages');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete package
exports.deletePackage = async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.redirect('/admin/packages');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
