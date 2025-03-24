const Recipe = require("../Schema/RecipeSchema");
const Liked = require("../Schema/LikedRecipeSchema");

const createRecipe = async (req, res) => {
  try {
    const { 
      title, 
      ingredients, 
      instructions, 
      imageUrl, 
      description, 
      cookTime, 
      difficulty,
      source,
      sourceId,
      area,
      category,
      tags,
      youtubeLink
    } = req.body;

    const newRecipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      imageUrl,
      description,
      cookTime,
      difficulty,
      source,
      sourceId,
      area,
      category,
      tags,
      youtubeLink
    });

    res.status(201).json(newRecipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllRecipes = async (req, res) => {
  try {
    const allRecipes = await Recipe.find();

    res.status(200).json(allRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;

    const deletedRecipe = await Recipe.deleteOne({ _id: recipeId });

    if (!deletedRecipe.deletedCount) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const recipes = await Recipe.find();

    res.status(200).json({ message: "Recipe deleted successfully", recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const LikedList = async (req, res) => {
  try {
    // If sourceId is provided in the request body, this is from an external API
    if (req.body && req.body.sourceId) {
      // Check if the recipe already exists in favorites
      const existingFavorite = await Liked.findOne({ sourceId: req.body.sourceId });
      
      if (existingFavorite) {
        return res.status(400).json({ error: "Recipe already exists in your favorites" });
      }
      
      // Create a new favorite recipe entry from the request body
      const newFavorite = await Liked.create(req.body);
      return res.status(201).json({ favoriteRecipe: newFavorite });
    } 
    // Otherwise, handle from internal database
    else {
      // Find the recipe by ID in the database
      let recipe = await Recipe.findOne({ _id: req.params.id });
      
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }

      // Check if the recipe exists in the user's favorites
      const existingFavorite = await Liked.findOne({ title: recipe.title });

      if (existingFavorite) {
        // Recipe already exists in favorites
        return res.status(400).json({ error: "Recipe already exists in your favorites" });
      } else {
        // Create a new favorite recipe entry with all fields
        const { 
          title, 
          ingredients, 
          instructions, 
          imageUrl, 
          description, 
          cookTime, 
          difficulty,
          source,
          sourceId,
          area,
          category,
          tags,
          youtubeLink
        } = recipe;
        
        const newFavorite = await Liked.create({
          title,
          ingredients,
          instructions,
          imageUrl,
          description, 
          cookTime, 
          difficulty,
          source,
          sourceId,
          area,
          category,
          tags,
          youtubeLink
        });

        // Respond with the newly added favorite recipe
        return res.status(201).json({ favoriteRecipe: newFavorite });
      }
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in Liked:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

const getAllLikedRecipes = async (req, res) => {
  try {
    const allLikedRecipes = await Liked.find();

    res.status(200).json(allLikedRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeFromLikedRecipes = async (req, res) => {
  try {
    const recipeId = req.params.id;

    // Find and delete the liked recipe by ID
    const deletedLikedRecipe = await Liked.deleteOne({ _id: recipeId });

    if (!deletedLikedRecipe.deletedCount) {
      return res.status(404).json({ error: "Liked recipe not found" });
    }

    res.status(200).json({ message: "Recipe removed from liked recipes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const searchRecipes = async (req, res) => {
  const searchKey = req.params.key;

  try {
    // Use a case-insensitive regular expression to search across multiple fields
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: new RegExp(searchKey, "i") } },
        { area: { $regex: new RegExp(searchKey, "i") } },
        { category: { $regex: new RegExp(searchKey, "i") } },
        { tags: { $regex: new RegExp(searchKey, "i") } },
        { description: { $regex: new RegExp(searchKey, "i") } }
      ]
    });

    // If no matching recipes found, return a meaningful message
    if (recipes.length === 0) {
      return res.status(404).json({ message: "No recipes found" });
    }

    // If matching recipes found, return them in the response
    res.status(200).json(recipes);
  } catch (error) {
    // Handle any server error and return a proper error response
    console.error("Error searching recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllRecipes,
  createRecipe,
  deleteRecipe,
  getAllLikedRecipes,
  LikedList,
  removeFromLikedRecipes,
  searchRecipes,
};
