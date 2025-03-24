import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Globe, Trash2, ChevronRight, Search } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SavedGeminiRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved recipes from localStorage
    try {
      const savedRecipes = JSON.parse(localStorage.getItem('savedGeminiRecipes') || '[]');
      setRecipes(savedRecipes);
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      toast.error('Error loading saved recipes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewRecipe = (recipe) => {
    // Save the selected recipe to localStorage and navigate to details page
    localStorage.setItem('currentGeminiRecipe', JSON.stringify(recipe));
    navigate('/gemini-recipe');
  };

  const handleDeleteRecipe = (index, recipeName) => {
    try {
      // Create a copy of the current recipes array
      const updatedRecipes = [...recipes];
      
      // Remove the recipe at the specified index
      updatedRecipes.splice(index, 1);
      
      // Update state and localStorage
      setRecipes(updatedRecipes);
      localStorage.setItem('savedGeminiRecipes', JSON.stringify(updatedRecipes));
      
      // Show success message
      toast.success(`Recipe "${recipeName}" deleted`);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast.error('Error deleting recipe');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="bottom-right" />
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your AI-Generated Recipes</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          These are recipes created by AI using your ingredients. You can view or delete them at any time.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <div 
              key={index}
              className="overflow-hidden bg-white rounded-xl shadow-sm transition-all duration-300 transform hover:shadow-md"
            >
              <div className="relative">
                <img
                  src={recipe.strMealThumb || "https://via.placeholder.com/1000x600?text=AI+Generated+Recipe"}
                  alt={recipe.strMeal}
                  className="w-full h-56 object-cover object-center sm:h-64"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded-full flex items-center gap-1">
                  <Globe size={14} />
                  <span className="text-xs font-medium">AI Generated</span>
                </div>
                
                <div className="absolute right-0 bottom-0 left-0 p-4 pt-10 bg-gradient-to-t to-transparent from-black/70">
                  <h3 className="text-xl font-medium text-white">{recipe.strMeal}</h3>
                  <p className="text-sm text-white/90">{recipe.strCategory || "Mixed"}</p>
                </div>
              </div>
              
              <div className="p-4">
                {/* Recipe action buttons */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>~30 mins</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteRecipe(index, recipe.strMeal)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Delete recipe"
                    >
                      <Trash2 size={18} />
                    </button>
                    
                    <button
                      onClick={() => handleViewRecipe(recipe)}
                      className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      View
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved recipes</h3>
          <p className="text-gray-600 mb-4">
            You haven't saved any AI-generated recipes yet. Go to the Ingredient Search page to create some!
          </p>
          <button 
            onClick={() => navigate('/ingredient-search')}
            className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Search by Ingredients
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedGeminiRecipes; 