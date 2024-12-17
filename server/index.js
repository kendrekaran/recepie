const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const router = express.Router();

app.use(express.json());


// const corsOptions = {
//   origin: ["https://recipeapp-vert.vercel.app", "http://localhost:3000","https://recipeapp-vert.vercel.app/auth"], // Replace with your frontend URL
//   methods: ["POST", "GET", "DELETE", "PUT"],
//   allowedHeaders: ["Content-Type", "Authorization"], // Add Authorization header here
// };
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://recipeapp-vert.vercel.app",
      "http://localhost:3000"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"], // Add OPTIONS here
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies if needed
};




app.use(cors(corsOptions));


const config = require("./db/config");
const Home = require("./controllers/controller");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const verifyToken = require("./Middleware/middleware");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");

app.use("/auth", LoginRoute);
app.use("/auth", RegisterRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", router);
app.use("/auth", ForgotPassword);

router.get("/", verifyToken, Home.Home);

module.exports = router;

if (config) {
  app.listen(process.env.PORT, () => {
    console.log(`Server Started on port ${process.env.PORT}`);
  });
}
