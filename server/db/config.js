const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://Harsh:Harsh%404512@cluster0.xdmnn.mongodb.net/DoxcAi")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
