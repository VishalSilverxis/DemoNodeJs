const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Database Connection
mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected To Database"));

const v1Router = require("./v1");
router.use("/v1", v1Router);

module.exports = router;