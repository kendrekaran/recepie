const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://karan902:I2zUU1l6WKEiB3ai@cluster0.byki5.mongodb.net/DoxcAi")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
