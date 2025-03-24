const mongoose = require("mongoose");

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

module.exports = mongoose.connection;
