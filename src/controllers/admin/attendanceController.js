const Attendance = require('../../models/Attendance');
const Member = require('../../models/Member');

// @desc    Get all attendance records
exports.getAttendance = async (req, res) => {
    try {
        const records = await Attendance.find()
            .populate({ path: 'member', populate: { path: 'user' } })
            .sort({ checkInTime: -1 });

        const members = await Member.find().populate('user');
            
        res.render('admin/attendance/index', { 
            title: 'Attendance Tracking', 
            records, 
            members,
            layout: 'admin/layout' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Check-in a member
exports.postCheckIn = async (req, res) => {
    try {
        await Attendance.create({ member: req.body.memberId });
        res.redirect('/admin/attendance');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Check-out a member
exports.postCheckOut = async (req, res) => {
    try {
        await Attendance.findByIdAndUpdate(req.params.id, { 
            checkOutTime: new Date() 
        });
        res.redirect('/admin/attendance');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete attendance record
exports.deleteAttendance = async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.redirect('/admin/attendance');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
