
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_name: {
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
    mobile: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country",
    },
    gender: {
        type: String,
        enum: ["male", "female", "other", "unknown"],
        default: "unknown",
        required: true,
        lowercase: true,
    },
    dob: {
        type: Date,
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

module.exports = mongoose.model("User", userSchema);