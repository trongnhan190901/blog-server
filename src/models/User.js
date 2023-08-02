const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, required: true, default: 'user' }, // Thêm trường role với giá trị mặc định là 'user'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
