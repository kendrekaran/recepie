const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

app.use(express.json());

app.use(cors("*"));

// MongoDB connection setup
// Log the MongoDB connection string (without credentials) for debugging
const connectionStringForLogging = process.env.MONGODB_URI 
  ? process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@') 
  : 'MongoDB URI is undefined';

console.log(`Attempting to connect to MongoDB: ${connectionStringForLogging}`);

// Enhanced connection options
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Increased timeout
  socketTimeoutMS: 45000, // Socket timeout
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: "majority"
};

// Handle connection events
mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Attempt the connection
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    console.log("Retrying connection in 5 seconds...");
    
    // Try again after a delay
    setTimeout(connectWithRetry, 5000);
  }
};

// Initial connection attempt
connectWithRetry();

// Store the connection in a variable for reference elsewhere
const dbConnection = mongoose.connection;

// Import other modules after DB connection is established
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

// Add connection status route for debugging
app.get("/status", (req, res) => {
  res.json({
    mongoDbState: dbConnection.readyState,
    env: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// For local development
if (dbConnection && process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 1000;
  app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
  });
}

// Export the Express application for serverless deployment
module.exports = app;
