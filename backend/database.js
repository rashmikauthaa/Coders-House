const mongoose = require('mongoose');

function DbConnect() {
    const DB_URL = process.env.DB_URL;

    // Database connection
    mongoose.connect(DB_URL)
        .then(() => console.log('✅ DB connected successfully!'))
        .catch(err => console.error('❌ DB connection error:', err));
}

module.exports = DbConnect;
