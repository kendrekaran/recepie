const mongoose = require("mongoose");

const LikedRecipes = new mongoose.Schema({
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

const Liked = mongoose.model("LikedRecipe", LikedRecipes);

module.exports = Liked;
