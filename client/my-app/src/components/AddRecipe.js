import React, { useState } from "react";
import "../styles/Addrecipe.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChefHat, X, Plus, Image, AlignLeft, BookOpen } from "lucide-react";

const AddRecipe = () => {
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
    description: "",
    cookTime: "",
    difficulty: "Easy"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({
      ...recipe,
      [name]: value,
    });
  };

  const handleAddIngredient = () => {
    const lastIngredient = recipe.ingredients[recipe.ingredients.length - 1];
    if (lastIngredient !== "") {
      setRecipe({
        ...recipe,
        ingredients: [...recipe.ingredients, ""],
      });
    }
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients[index] = value;
    setRecipe({
      ...recipe,
      ingredients: updatedIngredients,
    });
  };
  
  const handleRemoveIngredient = (index) => {
    if (recipe.ingredients.length > 1) {
      const updatedIngredients = recipe.ingredients.filter((_, i) => i !== index);
      setRecipe({
        ...recipe,
        ingredients: updatedIngredients,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const nonEmptyIngredients = recipe.ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );

    if (nonEmptyIngredients.length === 0) {
      toast.warn("Please provide at least one non-empty ingredient.");
      setIsSubmitting(false);
      return;
    }
    
    if (!recipe.title.trim()) {
      toast.warn("Please provide a recipe title.");
      setIsSubmitting(false);
      return;
    }
    
    if (!recipe.instructions.trim()) {
      toast.warn("Please provide recipe instructions.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify({
            ...recipe,
            ingredients: nonEmptyIngredients,
          }),
        }
      );

      if (response.ok) {
        toast.success("Recipe added successfully!");
        setTimeout(() => {
          window.location.href = "/recipes";
        }, 2000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add recipe");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const difficultyOptions = ["Easy", "Medium", "Hard"];

  return (
    <div className="py-8 min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-3xl">
        <div className="p-6 bg-white rounded-xl shadow-sm md:p-8">
          <div className="flex justify-center items-center mb-6">
            <div className="p-3 mr-3 bg-amber-100 rounded-full">
              <ChefHat className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">Create New Recipe</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="title" className="font-medium text-gray-700">Recipe Title</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={recipe.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title"
                  className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
                <BookOpen className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              </div>
            </div>
            
            {/* Description */}
            <div className="form-group">
              <label htmlFor="description" className="font-medium text-gray-700">Recipe Description</label>
              <div className="relative mt-1">
                <textarea
                  id="description"
                  name="description"
                  value={recipe.description}
                  onChange={handleInputChange}
                  placeholder="Describe your recipe in a few sentences"
                  className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows="2"
                />
                <AlignLeft className="absolute right-3 top-6 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            {/* Cook Time & Difficulty */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="form-group">
                <label htmlFor="cookTime" className="font-medium text-gray-700">Cook Time (minutes)</label>
                <input
                  type="number"
                  id="cookTime"
                  name="cookTime"
                  value={recipe.cookTime}
                  onChange={handleInputChange}
                  placeholder="e.g. 30"
                  className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="difficulty" className="font-medium text-gray-700">Difficulty</label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={recipe.difficulty}
                  onChange={handleInputChange}
                  className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {difficultyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Ingredients */}
            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-gray-700">Ingredients</label>
                <button 
                  type="button" 
                  onClick={handleAddIngredient} 
                  className="flex items-center text-sm text-amber-600 hover:text-amber-700"
                >
                  <Plus className="mr-1 w-4 h-4" />
                  Add Ingredient
                </button>
              </div>
              
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      placeholder={`Ingredient #${index + 1}`}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    {recipe.ingredients.length > 1 && (
                      <button 
                        type="button" 
                        className="p-2 ml-2 text-gray-500 transition-colors hover:text-red-500"
                        onClick={() => handleRemoveIngredient(index)}
                        aria-label="Remove ingredient"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Instructions */}
            <div className="form-group">
              <label htmlFor="instructions" className="font-medium text-gray-700">Instructions</label>
              <textarea
                id="instructions"
                name="instructions"
                value={recipe.instructions}
                onChange={handleInputChange}
                placeholder="Enter detailed step-by-step instructions"
                className="px-4 py-3 mt-1 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows="6"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Tip: Separate steps with a new line for better readability</p>
            </div>
            
            {/* Image URL */}
            <div className="form-group">
              <label htmlFor="imageUrl" className="font-medium text-gray-700">Image URL</label>
              <div className="relative mt-1">
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={recipe.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter URL for an image of your recipe"
                  className="px-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <Image className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              </div>
              <p className="mt-1 text-xs text-gray-500">Use a direct link to an image (jpg, png, etc.)</p>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-3 w-full font-medium text-white bg-amber-500 rounded-lg shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default AddRecipe;
