const Member = require('../../models/Member');
const Trainer = require('../../models/Trainer');
const Package = require('../../models/Package');
const Equipment = require('../../models/Equipment');
const Payment = require('../../models/Payment');

exports.getIndex = async (req, res) => {
    try {
        const [memberCount, trainerCount, packageCount, equipmentCount, totalRevenueArr] = await Promise.all([
            Member.countDocuments(),
            Trainer.countDocuments(),
            Package.countDocuments(),
            Equipment.countDocuments(),
            Payment.aggregate([
                { $match: { status: 'Success' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);

        const totalRevenue = totalRevenueArr.length > 0 ? totalRevenueArr[0].total : 0;

        const recentPayments = await Payment.find({ status: 'Success' })
            .populate({ path: 'member', populate: { path: 'user' } })
            .sort({ createdAt: -1 })
            .limit(5);

        const recentMembers = await Member.find()
            .populate('user')
            .sort({ createdAt: -1 })
            .limit(5);

        res.render('admin/dashboard', { 
            title: 'Admin Dashboard', 
            layout: 'admin/layout',
            stats: {
                memberCount,
                trainerCount,
                packageCount,
                equipmentCount,
                totalRevenue
            },
            recentPayments,
            recentMembers
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
