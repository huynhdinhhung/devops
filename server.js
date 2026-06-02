require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const morgan = require('morgan');
const methodOverride = require('method-override');
const connectDB = require('./src/config/db');
const cronService = require('./src/services/cronService');

// Passport Config
require('./src/config/passport')(passport);

// Connect to Database
connectDB();

// Init Cron Jobs
cronService.initCronJobs();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Static Files
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global variables (alerts, user info)
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Routes
app.use('/auth', require('./src/routes/auth'));
app.use('/admin', require('./src/routes/admin'));
app.use('/', require('./src/routes/index'));

// Auth Routes (Temporary placeholder)
// app.use('/auth', require('./src/routes/auth.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
