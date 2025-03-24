const express = require("express");
const router = express.Router();
const { getRecipeFromGemini } = require("../controllers/GeminiController");

// Route to get a recipe from Gemini based on ingredients
router.post("/gemini/recipe", getRecipeFromGemini);

module.exports = router; 