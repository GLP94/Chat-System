const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    content: String,
    user: String,
    time: Date
});

export default chatSchema