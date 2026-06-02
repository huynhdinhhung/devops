const Trainer = require('../../models/Trainer');
const User = require('../../models/User');

// @desc    Get all trainers
exports.getTrainers = async (req, res) => {
    try {
        const trainers = await Trainer.find().populate('user').sort({ createdAt: -1 });
        res.render('admin/trainers/index', { title: 'Manage Trainers', trainers, layout: 'admin/layout' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Show add trainer form
exports.getAddTrainer = (req, res) => {
    res.render('admin/trainers/add', { title: 'Add New Trainer', layout: 'admin/layout' });
};

// @desc    Add new trainer
exports.postAddTrainer = async (req, res) => {
    const { username, email, password, fullName, specialization, certificate, hireDate } = req.body;
    try {
        const user = await User.create({
            username, email, password, fullName, role: 'Trainer'
        });

        await Trainer.create({
            user: user._id, specialization, certificate, hireDate
        });

        res.redirect('/admin/trainers');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete trainer
exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await Trainer.findById(req.params.id);
        if (!trainer) return res.status(404).send('Trainer not found');

        await User.findByIdAndDelete(trainer.user);
        await Trainer.findByIdAndDelete(req.params.id);

        res.redirect('/admin/trainers');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
