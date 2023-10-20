require('dotenv').config()
const express = require('express')
var bodyParser = require('body-parser')
const app = express()
const port = 3000

const cors = require('cors');
app.use(cors());

app.use(bodyParser.json())

app.get('/', (req, res) => {
  return res.json({data:'Parth Panchal'})
})

const apiRouter = require("./routes/api");
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})