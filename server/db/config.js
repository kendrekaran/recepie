const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1/recipe-app")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
