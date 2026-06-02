const cron = require('node-cron');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
// const emailService = require('./emailService');

exports.initCronJobs = () => {
    // Run daily at 6:00 AM
    cron.schedule('0 6 * * *', async () => {
        console.log('Running daily notification job...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Find subscriptions ending tomorrow (as reminder) or today
            const expiringSoon = await Subscription.find({
                endDate: { $gte: today, $lt: tomorrow },
                status: 'Active'
            }).populate({
                path: 'member',
                populate: { path: 'user' }
            });

            expiringSoon.forEach(sub => {
                console.log(`Sending notification to ${sub.member.user.fullName} email: ${sub.member.user.email}`);
                // await emailService.sendEmail(...)
            });

        } catch (err) {
            console.error('Cron Job Error:', err);
        }
    });
};
