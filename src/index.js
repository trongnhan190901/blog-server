const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sessionStore = require('./auth/session.config');
require('./auth/passport'); // Import file passport.js đã tạo

const app = express();
const port = 5000;

mongoose.connect('mongodb://localhost:27017/BlogApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

const sessionSecret = crypto.randomBytes(32).toString('hex');
app.use(
    session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: false, // Chỉ đặt là true khi sử dụng HTTPS
        },
        store: sessionStore,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/category', categoryRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
