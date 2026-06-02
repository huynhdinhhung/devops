const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const enrollmentController = require('../controllers/user/enrollmentController');
const profileController = require('../controllers/user/profileController');
const newsController = require('../controllers/newsController');
const trainerPortalController = require('../controllers/trainerController');
const { ensureAuthenticated, isTrainer } = require('../middleware/auth');

router.get('/', (req, res) => {
    res.render('index', { title: 'GYM Manage System' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/packages', async (req, res) => {
    try {
        const packages = await Package.find({ status: 'Active' });
        res.render('packages', { title: 'Pricing Plans', packages });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Enrollment
router.get('/enroll/:packageId', ensureAuthenticated, enrollmentController.getCheckout);
router.post('/enroll/:packageId', ensureAuthenticated, enrollmentController.postEnroll);

// Profile
router.get('/profile', ensureAuthenticated, profileController.getProfile);
router.get('/profile/membership', ensureAuthenticated, profileController.getProfile); // Alias for success redirect

// News
router.get('/news', newsController.getNews);
router.get('/news/:id', newsController.getPost);

// Payment Callbacks
router.get('/payment/callback', enrollmentController.handlePaymentCallback);
router.post('/payment/ipn', enrollmentController.handlePaymentIPN);

// Trainer Portal
router.get('/trainer/schedule', ensureAuthenticated, isTrainer, trainerPortalController.getTrainerSchedule);
router.post('/trainer/schedule/:id/status', ensureAuthenticated, isTrainer, trainerPortalController.postUpdateScheduleStatus);

module.exports = router;
