const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/authRoutes");
const errorHandler = require("./middlewares/errorHandler");
const app = express();
const cors = require("cors");
app.use(cors());

require('dotenv').config();
//! Connect to mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Db connected successfully"))
  .catch((e) => console.log(e));

//! Middlewares
app.use(express.json()); //pass incoming json data from the user
//!Routes
app.use("/", router);
app.use("/test", (req, res) => {
  res.send("Hello World");
});
//!error handler
app.use(errorHandler);
//! Start the server
const PORT = 5000;
app.listen(PORT, console.log(`Server is up and running`));