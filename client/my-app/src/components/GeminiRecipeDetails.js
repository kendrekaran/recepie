import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Globe, Share2, Heart, Printer, Save } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GeminiRecipeDetails = () => {
  const [recipe, setRecipe] = useState(null);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Retrieve the Gemini recipe from localStorage
    const storedRecipe = localStorage.getItem('currentGeminiRecipe');
    
    if (storedRecipe) {
      try {
        const parsedRecipe = JSON.parse(storedRecipe);
        setRecipe(parsedRecipe);
        
        // Check if this recipe is already saved
        const savedRecipes = JSON.parse(localStorage.getItem('savedGeminiRecipes') || '[]');
        if (savedRecipes.some(r => r.strMeal === parsedRecipe.strMeal)) {
          setSaved(true);
        }
      } catch (error) {
        console.error('Error parsing recipe:', error);
        toast.error('Error loading recipe');
        setTimeout(() => {
          navigate('/ingredient-search');
        }, 2000);
      }
    } else {
      // If no recipe is found, redirect to the ingredient search page
      toast.error('Recipe not found');
      setTimeout(() => {
        navigate('/ingredient-search');
      }, 2000);
    }
  }, [navigate]);
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleSaveRecipe = () => {
    if (!recipe) return;
    
    try {
      // Get current saved recipes or initialize empty array
      const savedRecipes = JSON.parse(localStorage.getItem('savedGeminiRecipes') || '[]');
      
      // Check if recipe is already saved
      if (savedRecipes.some(r => r.strMeal === recipe.strMeal)) {
        toast.info('Recipe already saved');
        return;
      }
      
      // Add the recipe to saved recipes
      savedRecipes.push(recipe);
      localStorage.setItem('savedGeminiRecipes', JSON.stringify(savedRecipes));
      
      // Update state and show success message
      setSaved(true);
      toast.success('Recipe saved successfully');
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Error saving recipe');
    }
  };
  
  if (!recipe) {
    return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <ToastContainer />
        <div className="mb-4 w-12 h-12 rounded-full border-t-2 border-b-2 border-gray-900 animate-spin"></div>
        <p className="text-gray-600">Loading recipe...</p>
      </div>
    );
  }
  
  // Extract ingredients
  const ingredients = [];
  if (Array.isArray(recipe.strIngredients)) {
    // If the recipe is from Gemini API
    recipe.strIngredients.forEach((ingredient, index) => {
      if (ingredient && ingredient.trim()) {
        const measurement = recipe.strMeasurements && recipe.strMeasurements[index] 
          ? recipe.strMeasurements[index] 
          : "to taste";
        ingredients.push({ name: ingredient, measure: measurement });
      }
    });
  } else {
    // If the recipe is from MealDB format
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({ name: ingredient, measure: measure || "to taste" });
      }
    }
  }
  
  // Split instructions into steps
  const instructionSteps = recipe.strInstructions
    ? recipe.strInstructions.split(/\r?\n/).filter(step => step.trim().length > 0)
    : [];
  
  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <ToastContainer position="bottom-right" />
      
      {/* Back button */}
      <button
        onClick={handleGoBack}
        className="flex items-center mb-6 text-gray-600 transition-colors hover:text-gray-900"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to search
      </button>
      
      <div className="overflow-hidden bg-white rounded-xl shadow-lg">
        {/* Recipe header */}
        <div className="relative">
          <img
            src={recipe.strMealThumb || "https://via.placeholder.com/1000x600?text=AI+Generated+Recipe"}
            alt={recipe.strMeal}
            className="object-cover object-center w-full h-72"
          />
          <div className="flex absolute top-4 right-4 items-center px-3 py-1 text-white bg-green-500 rounded-full">
            <Globe size={14} className="mr-1" />
            <span className="text-sm font-medium">AI Generated</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/70"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex items-center mb-2 space-x-2">
              <span className="px-2 py-1 text-xs font-medium bg-blue-600 rounded-full">
                {recipe.strCategory || "Main"}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-amber-500 rounded-full">
                {recipe.strArea || "Fusion"}
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold">{recipe.strMeal}</h1>
            <div className="flex items-center text-white/80">
              <Clock size={16} className="mr-1" />
              <span className="text-sm">~ 30 minutes</span>
            </div>
          </div>
        </div>
        
        {/* Recipe content */}
        <div className="p-6">
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button 
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
              onClick={handlePrint}
            >
              <Printer size={16} className="mr-2" />
              Print Recipe
            </button>
            
            <button 
              className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                saved 
                  ? 'text-green-700 bg-green-100 cursor-default' 
                  : 'text-amber-700 bg-amber-100 hover:bg-amber-200'
              }`}
              onClick={handleSaveRecipe}
              disabled={saved}
            >
              {saved ? (
                <>
                  <Heart size={16} className="mr-2 fill-green-700" />
                  Saved
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Recipe
                </>
              )}
            </button>
          </div>
          
          {/* Ingredients and Instructions */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <h2 className="pb-2 mb-4 text-xl font-semibold border-b">Ingredients</h2>
              <ul className="space-y-3">
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-2 mr-2 w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                      <span className="text-gray-800">
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-gray-500"> - {ingredient.measure}</span>
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="italic text-gray-500">No ingredients found</li>
                )}
              </ul>
            </div>
            
            {/* Instructions */}
            <div className="md:col-span-2">
              <h2 className="pb-2 mb-4 text-xl font-semibold border-b">Instructions</h2>
              {instructionSteps.length > 0 ? (
                <ol className="space-y-6">
                  {instructionSteps.map((step, index) => (
                    <li key={index} className="flex">
                      <div className="flex flex-shrink-0 justify-center items-center mr-3 w-8 h-8 font-semibold text-white bg-blue-600 rounded-full">
                        {index + 1}
                      </div>
                      <div className="flex-grow pt-1">
                        <p className="text-gray-700">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="italic text-gray-500">No instructions found</p>
              )}
            </div>
          </div>
          
          {/* Tags */}
          {recipe.strTags && (
            <div className="pt-6 mt-8 border-t">
              <h3 className="mb-3 text-lg font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.strTags.split(',').map((tag, index) => (
                  <span key={index} className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-full">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Source info */}
          <div className="pt-6 mt-8 text-sm text-gray-500 border-t">
            <p>
              This recipe was generated by AI based on the ingredients you provided. 
              Results may vary when cooking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiRecipeDetails; 