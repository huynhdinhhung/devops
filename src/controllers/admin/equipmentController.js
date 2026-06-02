const Equipment = require('../../models/Equipment');

// @desc    Get all equipment
exports.getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find().sort({ nextMaintenance: 1 });
        res.render('admin/equipment/index', { title: 'Manage Equipment', equipment, layout: 'admin/layout' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Show add equipment form
exports.getAddEquipment = (req, res) => {
    res.render('admin/equipment/add', { title: 'Add Equipment', layout: 'admin/layout' });
};

// @desc    Add new equipment
exports.postAddEquipment = async (req, res) => {
    try {
        await Equipment.create(req.body);
        res.redirect('/admin/equipment');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Update equipment status
exports.updateStatus = async (req, res) => {
    try {
        await Equipment.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.redirect('/admin/equipment');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete equipment
exports.deleteEquipment = async (req, res) => {
    try {
        await Equipment.findByIdAndDelete(req.params.id);
        res.redirect('/admin/equipment');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
