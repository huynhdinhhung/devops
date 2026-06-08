const Member = require('../../models/Member');
const User = require('../../models/User');

// @desc    Get all members (with optional search & status filter)
// @route   GET /admin/members
exports.getMembers = async (req, res) => {
    try {
        const { q, status } = req.query;
        let members;

        const hasFilter = (q && q.trim()) || status;
        if (hasFilter) {
            const userFilter = {};
            if (q && q.trim()) {
                const keyword = q.trim();
                userFilter.$or = [
                    { fullName: { $regex: keyword, $options: 'i' } },
                    { email: { $regex: keyword, $options: 'i' } },
                    { username: { $regex: keyword, $options: 'i' } }
                ];
            }
            if (status) {
                userFilter.status = status;
            }

            const users = await User.find(userFilter).select('_id');
            const userIds = users.map(u => u._id);
            members = await Member.find({ user: { $in: userIds } })
                .populate('user')
                .sort({ createdAt: -1 });
        } else {
            members = await Member.find().populate('user').sort({ createdAt: -1 });
        }

        res.render('admin/members/index', { 
            title: 'Hội viên', 
            members,
            query: { q: q || '', status: status || '' },
            layout: 'admin/layout' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Show add member form
// @route   GET /admin/members/add
exports.getAddMember = (req, res) => {
    res.render('admin/members/add', { 
        title: 'Add New Member', 
        layout: 'admin/layout' 
    });
};

// @desc    Add new member (creates both User and Member)
// @route   POST /admin/members/add
exports.postAddMember = async (req, res) => {
    const { username, email, password, fullName, birthDate, gender, phone, address } = req.body;
    try {
        // 1. Create User
        const user = await User.create({
            username,
            email,
            password,
            fullName,
            role: 'User'
        });

        // 2. Create Member linked to User
        await Member.create({
            user: user._id,
            birthDate,
            gender,
            phone,
            address
        });

        res.redirect('/admin/members');
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.render('admin/members/add', { 
                title: 'Add New Member', 
                layout: 'admin/layout',
                error: 'Username or Email already exists' 
            });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Show edit member form
// @route   GET /admin/members/edit/:id
exports.getEditMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate('user');
        if (!member) return res.status(404).send('Member not found');
        
        res.render('admin/members/edit', { 
            title: 'Edit Member', 
            member, 
            layout: 'admin/layout' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Update member
// @route   POST /admin/members/edit/:id
exports.postEditMember = async (req, res) => {
    const { fullName, email, birthDate, gender, phone, address, status } = req.body;
    try {
        const member = await Member.findById(req.params.id).populate('user');
        if (!member) return res.status(404).send('Member not found');

        // Update User info
        member.user.fullName = fullName;
        member.user.email = email;
        member.user.status = status;
        await member.user.save();

        // Update Member info
        member.birthDate = birthDate;
        member.gender = gender;
        member.phone = phone;
        member.address = address;
        await member.save();

        res.redirect('/admin/members');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete member
// @route   DELETE /admin/members/:id
exports.deleteMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).send('Member not found');

        // Delete associated User
        await User.findByIdAndDelete(member.user);
        // Delete Member
        await Member.findByIdAndDelete(req.params.id);

        res.redirect('/admin/members');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
