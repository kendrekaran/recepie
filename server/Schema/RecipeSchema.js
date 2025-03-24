const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: [String],
  instructions: {
    type: String,
    required: true,
  },
  imageUrl: String,
  description: String,
  cookTime: String,
  difficulty: String,
  source: String,
  sourceId: String,
  area: String,
  category: String,
  tags: String,
  youtubeLink: String
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
