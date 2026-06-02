const Member = require('../../models/Member');
const Subscription = require('../../models/Subscription');
const Payment = require('../../models/Payment');
const Schedule = require('../../models/Schedule');

// @desc    Show user profile & membership
// @route   GET /profile
exports.getProfile = async (req, res) => {
    try {
        const member = await Member.findOne({ user: req.user._id }).populate('user');
        if (!member) return res.status(404).send('Member profile not found');

        const activeSubscription = await Subscription.findOne({ 
            member: member._id,
            status: 'Active'
        }).populate('package');

        const payments = await Payment.find({ member: member._id })
            .populate('subscription')
            .sort({ createdAt: -1 });

        const schedules = await Schedule.find({ member: member._id })
            .populate({ path: 'trainer', populate: { path: 'user' } })
            .sort({ startTime: 1 });

        res.render('user/dashboard', { 
            title: 'Bảng điều khiển Hội viên', 
            member, 
            activeSubscription, 
            payments,
            schedules,
            success: req.query.success === 'true'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
