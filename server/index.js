const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());



app.use(cors("*"));

const config = require("./db/config");
const Home = require("./controllers/controller");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const verifyToken = require("./Middleware/middleware");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");
const GeminiRoute = require("./routes/GeminiRoute");

// Mount all routes
app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", ForgotPassword);
app.use("/auth", GeminiRoute);

// Home route
app.get("/auth", verifyToken, Home.Home);

// For local development
if (config && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 1000;
  app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
  });
}

// Export the Express application for serverless deployment
module.exports = app;
