const Schedule = require('../../models/Schedule');
const Member = require('../../models/Member');
const Trainer = require('../../models/Trainer');

// @desc    Get all schedules
exports.getSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate({ path: 'member', populate: { path: 'user' } })
            .populate({ path: 'trainer', populate: { path: 'user' } })
            .sort({ startTime: -1 });
            
        res.render('admin/schedules/index', { title: 'Manage Schedules', schedules, layout: 'admin/layout' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Show add schedule form
exports.getAddSchedule = async (req, res) => {
    try {
        const members = await Member.find().populate('user');
        const trainers = await Trainer.find().populate('user');
        res.render('admin/schedules/add', { title: 'Create Schedule', members, trainers, layout: 'admin/layout' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Add new schedule
exports.postAddSchedule = async (req, res) => {
    try {
        await Schedule.create(req.body);
        res.redirect('/admin/schedules');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Update schedule status
exports.updateStatus = async (req, res) => {
    try {
        await Schedule.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.redirect('/admin/schedules');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete schedule
exports.deleteSchedule = async (req, res) => {
    try {
        await Schedule.findByIdAndDelete(req.params.id);
        res.redirect('/admin/schedules');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
