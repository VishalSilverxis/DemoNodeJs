
const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
    deleted_at: {
        type: Date,
    },
});

module.exports = mongoose.model("AdminUser", adminUserSchema);