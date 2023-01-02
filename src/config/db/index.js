const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/asm1_nodejs_dev');
        console.log('connect susscess');
    } catch (error) {
        console.log('connect fail');
    }
    
};

module.exports = { connect };