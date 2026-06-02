const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/admin/dashboardController');
const packageController = require('../controllers/admin/packageController');
const memberController = require('../controllers/admin/memberController');
const trainerController = require('../controllers/admin/trainerController');
const scheduleController = require('../controllers/admin/scheduleController');
const equipmentController = require('../controllers/admin/equipmentController');
const postController = require('../controllers/admin/postController');
const attendanceController = require('../controllers/admin/attendanceController');
const reportController = require('../controllers/admin/reportController');
const { ensureAuthenticated, isAdmin } = require('../middleware/auth');

// Protect all admin routes
router.use(ensureAuthenticated, isAdmin);

router.get('/', dashboardController.getIndex);
router.get('/dashboard', (req, res) => res.redirect('/admin'));

// Packages
router.get('/packages', packageController.getPackages);
router.get('/packages/add', packageController.getAddPackage);
router.post('/packages/add', packageController.postAddPackage);
router.delete('/packages/:id', packageController.deletePackage);

// Members
router.get('/members', memberController.getMembers);
router.get('/members/add', memberController.getAddMember);
router.post('/members/add', memberController.postAddMember);
router.get('/members/edit/:id', memberController.getEditMember);
router.post('/members/edit/:id', memberController.postEditMember);
router.delete('/members/:id', memberController.deleteMember);

// Trainers
router.get('/trainers', trainerController.getTrainers);
router.get('/trainers/add', trainerController.getAddTrainer);
router.post('/trainers/add', trainerController.postAddTrainer);
router.delete('/trainers/:id', trainerController.deleteTrainer);

// Schedules
router.get('/schedules', scheduleController.getSchedules);
router.get('/schedules/add', scheduleController.getAddSchedule);
router.post('/schedules/add', scheduleController.postAddSchedule);
router.post('/schedules/status/:id', scheduleController.updateStatus);
router.delete('/schedules/:id', scheduleController.deleteSchedule);

// Equipment
router.get('/equipment', equipmentController.getEquipment);
router.get('/equipment/add', equipmentController.getAddEquipment);
router.post('/equipment/add', equipmentController.postAddEquipment);
router.post('/equipment/status/:id', equipmentController.updateStatus);
router.delete('/equipment/:id', equipmentController.deleteEquipment);

// Posts
router.get('/posts', postController.getPosts);
router.get('/posts/add', postController.getAddPost);
router.post('/posts/add', postController.postAddPost);
router.delete('/posts/:id', postController.deletePost);

// Attendance
router.get('/attendance', attendanceController.getAttendance);
router.post('/attendance/checkin', attendanceController.postCheckIn);
router.post('/attendance/checkout/:id', attendanceController.postCheckOut);
router.delete('/attendance/:id', attendanceController.deleteAttendance);

// Reports
router.get('/reports/revenue', reportController.exportRevenueReport);

module.exports = router;
