//State model

const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country", //refrence to Country Schema
  },
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  state_code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
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

module.exports = mongoose.model("State", stateSchema);
