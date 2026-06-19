require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const logger = require("./middleware/logger");

const app = express();

app.use(bodyParser.json());

app.use(logger);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});

app.use("/api/books", require("./routes/books"));


// Invalid Route Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});


// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
