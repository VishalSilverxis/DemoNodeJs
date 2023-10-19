//Country

const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  mobile_code: {
    type: Number,
    required: true,
  },
  flag: {
    type: String,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model("Country", countrySchema);
