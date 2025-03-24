import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, X, Loader2, Search, Filter, Trash2, ChevronRight, Clock, Gift, Globe, ExternalLink } from "lucide-react";
import { findMealsByIngredients } from "../utils/mealDbService";
import { getRecipeFromGemini } from "../utils/geminiService";
import { Link } from "react-router-dom";

const IngredientTag = ({ ingredient, onRemove }) => {
  return (
    <div className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2">
      <span className="mr-1">{ingredient}</span>
      <button onClick={() => onRemove(ingredient)} className="text-blue-600 hover:text-blue-800">
        <X size={16} />
      </button>
    </div>
  );
};

const RecipeCard = ({ recipe, source, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract ingredients and measurements from recipe
  const ingredients = [];
  if (Array.isArray(recipe.strIngredients)) {
    // If the recipe is from Gemini API
    recipe.strIngredients.forEach((ingredient, index) => {
      if (ingredient && ingredient.trim()) {
        const measurement = recipe.strMeasurements && recipe.strMeasurements[index] 
          ? recipe.strMeasurements[index] 
          : "to taste";
        ingredients.push(`${ingredient} (${measurement})`);
      }
    });
  } else {
    // If the recipe is from MealDB
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} (${measure || "to taste"})`);
      }
    }
  }

  return (
    <div 
      className="overflow-hidden bg-white rounded-xl shadow-sm transition-all duration-300 transform hover:shadow-md hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={recipe.strMealThumb || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
          alt={recipe.strMeal}
          className="object-cover w-full h-56 transition-transform duration-700 sm:h-64"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        {recipe.strArea && (
          <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
            {recipe.strArea}
          </div>
        )}
        {source === 'gemini' && (
          <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full flex items-center gap-1">
            <Globe size={12} />
            AI Generated
          </div>
        )}
        
        <div className="absolute right-0 bottom-0 left-0 p-4 pt-10 bg-gradient-to-t to-transparent from-black/70">
          <h3 className="text-xl font-medium text-white">{recipe.strMeal}</h3>
          <p className="text-sm text-white/90">{recipe.strCategory || "Mixed"}</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
          <ul className="text-sm text-gray-600 space-y-1 max-h-24 overflow-y-auto">
            {ingredients.slice(0, 5).map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
            {ingredients.length > 5 && (
              <li className="text-gray-500 italic">+ {ingredients.length - 5} more</li>
            )}
          </ul>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock size={16} className="mr-1" />
            <span>~30 mins</span>
          </div>
          
          <button
            onClick={() => onViewDetails(recipe)}
            className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            View Recipe
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

const IngredientSearch = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSource, setLoadingSource] = useState(''); // 'ai', 'db', or ''
  const [recipes, setRecipes] = useState([]);
  const [mealDbRecipes, setMealDbRecipes] = useState([]);
  const [geminiRecipe, setGeminiRecipe] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const handleAddIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddIngredient();
    }
  };
  
  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter(item => item !== ingredient));
  };
  
  // Search in MealDB database
  const handleDatabaseSearch = async () => {
    if (ingredients.length === 0) {
      toast.warning("Please add at least one ingredient");
      return;
    }
    
    setIsLoading(true);
    setLoadingSource('db');
    setMealDbRecipes([]);
    
    try {
      // Search in MealDB
      const mealDbResults = await findMealsByIngredients(ingredients);
      setMealDbRecipes(mealDbResults);
      
      // Update all recipes
      let allRecipes = [...mealDbResults];
      if (geminiRecipe) {
        allRecipes.push(geminiRecipe);
      }
      setRecipes(allRecipes);
      
      if (mealDbResults.length === 0) {
        toast.info("No recipes found in database with those ingredients. Try generating an AI recipe instead.");
      } else {
        toast.success(`Found ${mealDbResults.length} recipes in database.`);
      }
      
      // Switch to database tab if results found
      if (mealDbResults.length > 0) {
        setActiveTab('mealdb');
      }
    } catch (error) {
      console.error("Error searching database recipes:", error);
      toast.error("Error searching the recipe database. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingSource('');
    }
  };
  
  // Generate recipe with Gemini AI
  const handleAIGeneration = async () => {
    if (ingredients.length === 0) {
      toast.warning("Please add at least one ingredient");
      return;
    }
    
    setIsLoading(true);
    setLoadingSource('ai');
    setGeminiRecipe(null);
    
    try {
      // Get AI-generated recipe
      const geminiResult = await getRecipeFromGemini(ingredients);
      if (geminiResult) {
        setGeminiRecipe(geminiResult);
        
        // Update all recipes
        let allRecipes = [...mealDbRecipes, geminiResult];
        setRecipes(allRecipes);
        
        toast.success("AI successfully generated a recipe with your ingredients!");
        
        // Switch to AI tab if result was generated
        setActiveTab('gemini');
      } else {
        toast.error("Failed to generate an AI recipe. Please try different ingredients.");
      }
    } catch (error) {
      console.error("Error generating AI recipe:", error);
      toast.error("Error generating AI recipe. Please try again.");
    } finally {
      setIsLoading(false);
      setLoadingSource('');
    }
  };

  const handleViewDetails = (recipe) => {
    // If it's a MealDB recipe with an ID, navigate to the meal details page
    if (recipe.idMeal) {
      window.location.href = `/meal/${recipe.idMeal}`;
    } else {
      // For Gemini-generated recipes that don't have an ID
      // Store the Gemini recipe in localStorage and navigate to the details page
      localStorage.setItem('currentGeminiRecipe', JSON.stringify(recipe));
      window.location.href = '/gemini-recipe';
    }
  };
  
  const filteredRecipes = () => {
    switch (activeTab) {
      case 'mealdb':
        return mealDbRecipes;
      case 'gemini':
        return geminiRecipe ? [geminiRecipe] : [];
      default:
        return recipes;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="bottom-right" />
      
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Recipes by Ingredients</h1>
        <p className="text-gray-600 mb-6">
          Enter the ingredients you have on hand, then choose to search our database 
          for matching recipes or let AI create a custom recipe with your ingredients!
        </p>
        
        <div className="flex flex-wrap mb-4">
          {ingredients.map((ingredient, index) => (
            <IngredientTag 
              key={index} 
              ingredient={ingredient} 
              onRemove={handleRemoveIngredient} 
            />
          ))}
        </div>
        
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Add an ingredient (e.g., chicken, rice, tomatoes)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            onClick={handleAddIngredient}
            className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <Plus size={20} className="mr-1" />
            Add
          </button>
        </div>
        
        <div className="flex flex-col mt-4 space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <button
            onClick={handleDatabaseSearch}
            disabled={isLoading || ingredients.length === 0}
            className={`inline-flex items-center justify-center px-4 py-3 font-medium rounded-lg transition-colors ${
              isLoading || ingredients.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } flex-1`}
          >
            {isLoading && loadingSource === 'db' ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Searching Database...
              </>
            ) : (
              <>
                <Search size={20} className="mr-2" />
                Search in Database
              </>
            )}
          </button>
          
          <button
            onClick={handleAIGeneration}
            disabled={isLoading || ingredients.length === 0}
            className={`inline-flex items-center justify-center px-4 py-3 font-medium rounded-lg transition-colors ${
              isLoading || ingredients.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            } flex-1`}
          >
            {isLoading && loadingSource === 'ai' ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Generating AI Recipe...
              </>
            ) : (
              <>
                <Globe size={20} className="mr-2" />
                Create Recipe with AI
              </>
            )}
          </button>
        </div>
      </div>
      
      {recipes.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
          
          <div className="flex flex-wrap space-x-0 space-y-2 md:space-y-0 md:space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Recipes ({recipes.length})
            </button>
            
            <button
              onClick={() => setActiveTab('mealdb')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'mealdb'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Database ({mealDbRecipes.length})
            </button>
            
            <button
              onClick={() => setActiveTab('gemini')}
              className={`px-4 py-2 rounded-full ${
                activeTab === 'gemini'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              AI Generated {geminiRecipe ? '(1)' : '(0)'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes().map((recipe, index) => (
              <RecipeCard
                key={recipe.idMeal || `gemini-${index}`}
                recipe={recipe}
                source={recipe.source || 'mealdb'}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        </div>
      )}
      
      {isLoading && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 size={40} className="animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">
            {loadingSource === 'db' 
              ? "Searching for recipes that match your ingredients..." 
              : "AI is creating a custom recipe with your ingredients..."}
          </p>
        </div>
      )}
      
      {!isLoading && ingredients.length > 0 && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes found</h3>
          <p className="text-gray-600 mb-4">Try adding more common ingredients or try a different search method.</p>
        </div>
      )}
    </div>
  );
};

export default IngredientSearch; 