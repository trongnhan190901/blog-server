const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/BlogApp', // Thay đổi đường dẫn MongoDB của bạn
    collection: 'sessions', // Tên của collection để lưu trữ session
    expires: 7 * 24 * 60 * 60 * 1000, // Thời gian hết hạn cho session (7 ngày)
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
});

module.exports = store;
