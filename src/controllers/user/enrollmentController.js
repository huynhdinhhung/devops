const Package = require('../../models/Package');
const Member = require('../../models/Member');
const Subscription = require('../../models/Subscription');
const Payment = require('../../models/Payment');
const momoService = require('../../services/momoService');

// @desc    Show package selection/checkout
// @route   GET /enroll/:packageId
exports.getCheckout = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.packageId);
        if (!pkg) return res.redirect('/packages');

        res.render('enroll/checkout', { title: 'Checkout', pkg });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// @desc    Process enrollment & payment
// @route   POST /enroll/:packageId
exports.postEnroll = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.packageId);
        const member = await Member.findOne({ user: req.user._id });

        if (!pkg || !member) return res.status(400).send('Invalid request');

        // Create initial Subscription (Pending)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + pkg.duration);

        const subscription = await Subscription.create({
            member: member._id,
            package: pkg._id,
            startDate,
            endDate,
            status: 'Cancelled' // Start as cancelled until payment success
        });

        // Create Payment record
        const payment = await Payment.create({
            member: member._id,
            subscription: subscription._id,
            amount: pkg.price,
            method: 'Momo',
            status: 'Pending',
            transactionId: `ORDER_${Date.now()}`
        });

        // Redirect to Momo (Mocking for now if keys not set)
        if (!process.env.MOMO_PARTNER_CODE) {
            // Simulate success for demo if no API keys
            payment.status = 'Success';
            subscription.status = 'Active';
            await Promise.all([payment.save(), subscription.save()]);
            return res.redirect('/profile/membership?success=true');
        }

        const momoResponse = await momoService.createPayment(
            `Gym Package: ${pkg.packageName}`,
            pkg.price,
            payment._id.toString(),
            payment.transactionId
        );

        if (momoResponse.payUrl) {
            res.redirect(momoResponse.payUrl);
        } else {
            res.status(500).send('Momo Payment Initialization Failed');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
// @desc    Handle Momo Redirect Callback
// @route   GET /payment/callback
exports.handlePaymentCallback = async (req, res) => {
    try {
        const { orderId, resultCode, message } = req.query;
        
        // 0 means success in Momo
        if (resultCode == 0) {
            const payment = await Payment.findOne({ transactionId: orderId });
            if (payment) {
                payment.status = 'Success';
                await payment.save();

                const subscription = await Subscription.findById(payment.subscription);
                if (subscription) {
                    subscription.status = 'Active';
                    await subscription.save();
                }
            }
            return res.redirect('/profile/membership?success=true');
        } else {
            console.log(`Payment failed: ${message}`);
            return res.redirect('/profile/membership?success=false&error=' + encodeURIComponent(message));
        }
    } catch (err) {
        console.error('Momo Callback Error:', err);
        res.redirect('/profile/membership?success=false');
    }
};

// @desc    Handle Momo IPN (Instant Payment Notification)
// @route   POST /payment/ipn
exports.handlePaymentIPN = async (req, res) => {
    try {
        const { orderId, resultCode } = req.body;
        console.log('Received IPN for Order:', orderId, 'Result:', resultCode);

        if (resultCode == 0) {
            const payment = await Payment.findOne({ transactionId: orderId });
            if (payment && payment.status !== 'Success') {
                payment.status = 'Success';
                await payment.save();

                const subscription = await Subscription.findById(payment.subscription);
                if (subscription) {
                    subscription.status = 'Active';
                    await subscription.save();
                }
            }
        }
        res.status(204).send(); // Momo requires 204 or 200 with specific body
    } catch (err) {
        console.error('Momo IPN Error:', err);
        res.status(500).send();
    }
};
