const Schedule = require('../models/Schedule');
const Trainer = require('../models/Trainer');

// @desc    Show trainer's assigned schedule
// @route   GET /trainer/schedule
exports.getTrainerSchedule = async (req, res) => {
    try {
        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer) return res.status(403).send('Not authorized as trainer');

        const schedules = await Schedule.find({ trainer: trainer._id })
            .populate({ path: 'member', populate: { path: 'user' } })
            .sort({ startTime: 1 });

        res.render('trainer/dashboard', { title: 'Bảng điều khiển Huấn luyện viên', schedules });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Update schedule status
// @route   POST /trainer/schedule/:id/status
exports.postUpdateScheduleStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const schedule = await Schedule.findById(req.params.id);
        
        if (!schedule) return res.status(404).send('Schedule not found');
        
        // Verify this trainer owns this schedule
        const trainer = await Trainer.findOne({ user: req.user._id });
        if (!trainer || schedule.trainer.toString() !== trainer._id.toString()) {
            return res.status(403).send('Not authorized');
        }

        schedule.status = status;
        await schedule.save();

        res.redirect('/trainer/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
