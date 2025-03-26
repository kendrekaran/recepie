import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, Search, Heart, Trash2, ChevronRight, Filter, Clock, Gift, Globe, ExternalLink } from "lucide-react";
import { getRandomMeal, formatMealToRecipe, getMealsByCategory, getMealsByArea } from "../utils/mealDbService";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const CategoryButton = ({ label, icon, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
        active 
          ? "text-white bg-gray-900 border-gray-900 shadow-sm" 
          : "text-gray-800 bg-white border-gray-200 hover:bg-gray-100"
      }`}
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

const RecipeCard = ({ recipe, onDelete, onAddToFavorites }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="overflow-hidden bg-white rounded-xl shadow-sm transition-all duration-300 transform hover:shadow-md hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
          alt={recipe.title}
          className="object-cover w-full h-56 transition-transform duration-700 sm:h-64"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        {recipe.area && (
          <div className="absolute top-3 left-3 px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full">
            {recipe.area}
          </div>
        )}
        <div className="flex absolute top-3 right-3 gap-1 items-center px-2 py-1 text-sm bg-white rounded-full shadow-md">
          <Eye className="w-4 h-4 text-amber-500" />
          <span>250+</span>
        </div>
        
        <div className="absolute right-0 bottom-0 left-0 p-4 pt-10 bg-gradient-to-t to-transparent from-black/70">
          <h3 className="text-xl font-bold text-white">{recipe.title}</h3>
          {recipe.category && (
            <span className="text-sm text-gray-200">{recipe.category}</span>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex gap-2 items-center mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="mr-1 w-4 h-4" />
            <span>{recipe.cookTime || "30"} min</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center">
            <Gift className="mr-1 w-4 h-4" />
            <span>{recipe.difficulty || "Easy"}</span>
          </div>
        </div>
        
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {recipe.description || "Delicious recipe to try with family and friends. Perfect for any occasion."}
        </p>
        
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => onAddToFavorites(recipe)}
            className="flex flex-1 gap-2 justify-center items-center px-4 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-full transition-colors hover:bg-gray-800"
          >
            <span>Add to Favorites</span>
            <Heart className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(recipe._id)}
              className="p-2.5 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600"
              aria-label="Delete recipe"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Types");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [randomMeals, setRandomMeals] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [indianCuisine, setIndianCuisine] = useState([]);
  const [italianCuisine, setItalianCuisine] = useState([]);
  const [loadingCuisines, setLoadingCuisines] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getRecipes();
    fetchRandomMeals();
    fetchCuisineRecipes();
  }, []);

  const fetchRandomMeals = async () => {
    try {
      setLoadingRecommendations(true);
      const meals = [];
      // Fetch 4 random meals
      for (let i = 0; i < 4; i++) {
        const meal = await getRandomMeal();
        if (meal && !meals.some(m => m.idMeal === meal.idMeal)) {
          meals.push(meal);
        }
      }
      setRandomMeals(meals);
      setLoadingRecommendations(false);
    } catch (error) {
      console.error("Error fetching random meals:", error);
      setLoadingRecommendations(false);
    }
  };

  const fetchCuisineRecipes = async () => {
    try {
      setLoadingCuisines(true);

      // Fetch Indian cuisine recipes
      const indianMeals = await getMealsByArea("Indian");
      setIndianCuisine(indianMeals.slice(0, 4));

      // Fetch Italian cuisine recipes
      const italianMeals = await getMealsByArea("Italian");
      setItalianCuisine(italianMeals.slice(0, 4));

      setLoadingCuisines(false);
    } catch (error) {
      console.error("Error fetching cuisine recipes:", error);
      setLoadingCuisines(false);
    }
  };

  const getRecipes = () => {
    setLoading(true);
    
    // Check if token exists
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found in localStorage");
      setLoading(false);
      toast.error("You are not logged in. Please log in to view recipes.");
      return;
    }
    
    console.log("Using token:", token.substring(0, 15) + "..."); // Log part of the token for debugging
    
    fetch(`${process.env.REACT_APP_API_URL}/recipe`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("Authentication failed. Please log in again.");
          }
          throw new Error("Failed to fetch recipe data");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Recipes loaded:", data.length);
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Recipe fetch error:", error.message);
        setLoading(false);
        toast.error(error.message || "Failed to load recipes. Please try again.");
      });
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        toast.info("Deleting recipe...");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/recipe/${recipeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.ok) {
          toast.success("Recipe deleted successfully");
          // Update the UI immediately instead of forcing a page reload
          setRecipes(recipes.filter(recipe => recipe._id !== recipeId));
        } else {
          toast.error("Failed to delete recipe");
          getRecipes();
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the recipe");
      console.error(error);
    }
  };

  const handleAddToFavorites = async (meal) => {
    try {
      // Check if the meal is from MealDB (has idMeal property)
      if (meal.idMeal) {
        toast.info("Adding to favorites...");
        
        // If the meal doesn't have instructions (likely from a list/filter endpoint),
        // we need to fetch complete meal details first
        let completeData = meal;
        if (!meal.strInstructions) {
          const { getMealById } = await import("../utils/mealDbService");
          completeData = await getMealById(meal.idMeal);
          if (!completeData) {
            toast.error("Could not fetch complete recipe details");
            return;
          }
        }
        
        // Format MealDB data to match our app's recipe format
        const formattedRecipe = formatMealToRecipe(completeData);
        
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/likedRecipes/${formattedRecipe.sourceId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
            body: JSON.stringify(formattedRecipe),
          }
        );

        if (response.ok) {
          toast.success("Recipe added to favorites successfully");
        } else {
          const data = await response.json();
          if (data.error === "Recipe already exists in your favorites") {
            toast.warn("Recipe already exists in your favorites");
          } else {
            toast.error(data.error || "Failed to add to favorites");
          }
        }
      } else {
        // This is a recipe from our own database
        const recipeId = meal._id;
        toast.info("Adding to favorites...");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/likedRecipes/${recipeId}`,
          {
            method: "POST",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.ok) {
          toast.success("Recipe added to favorites successfully");
        } else {
          const data = await response.json();
          if (data.error === "Recipe already exists in your favorites") {
            toast.warn("Recipe already exists in your favorites");
          } else {
            toast.error(data.error || "Failed to add to favorites");
          }
        }
      }
    } catch (error) {
      toast.error("An error occurred while adding to favorites");
      console.error(error);
    }
  };

  const handleMealDBSearch = (mealResults) => {
    if (mealResults && mealResults.length > 0) {
      setRecipes(mealResults.map(meal => ({
        _id: meal.idMeal,
        title: meal.strMeal,
        imageUrl: meal.strMealThumb,
        category: meal.strCategory,
        area: meal.strArea,
        description: meal.strInstructions ? meal.strInstructions.substring(0, 100) + '...' : '',
        difficulty: "Medium",
        cookTime: "30",
        idMeal: meal.idMeal
      })));
    } else if (searchTerm) {
      // If MealDB returns no results but we have a search term, show empty state
      setRecipes([]);
    } else {
      // If search is cleared, fetch original recipes
      getRecipes();
    }
  };

  // Helper function to render cuisine section
  const renderCuisineSection = (title, meals, emoji) => (
    <section className="py-10">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
            {emoji} <span className="text-amber-500">{title}</span> Cuisine
          </h2>
          <Link 
            to="/explore" 
            className="flex gap-1 items-center font-medium text-amber-600 hover:text-amber-700"
          >
            <span>View All</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        
        {loadingCuisines ? (
          <div className="flex justify-center items-center p-12">
            <div className="w-12 h-12 rounded-full border-b-2 border-amber-500 animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {meals.map((meal) => (
              <div key={meal.idMeal} className="overflow-hidden bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="relative">
                  <img
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="object-cover w-full h-48"
                  />
                  <div className="absolute right-0 bottom-0 left-0 p-4 bg-gradient-to-t to-transparent from-black/70">
                    <h3 className="text-lg font-bold text-white">{meal.strMeal}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/meal/${meal.idMeal}`}
                      className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-amber-500 rounded transition-colors hover:bg-amber-600"
                    >
                      View Recipe
                    </Link>
                    <button
                      onClick={() => handleAddToFavorites(meal)}
                      className="p-2 text-white bg-gray-800 rounded transition-colors hover:bg-gray-900"
                      aria-label="Add to favorites"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[280px] sm:h-[350px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-r to-transparent from-gray-900/80 via-gray-900/60"></div>
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop"
          alt="Culinary dish"
          className="object-cover w-full h-full"
        />
        <div className="container px-4 mx-auto">
          <div className="absolute right-0 left-0 top-1/2 z-20 transform -translate-y-1/2">
            <div className="px-4 max-w-xl sm:px-16">
              <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl">
                Discover <span className="text-amber-400">Delicious</span> Recipes
              </h1>
              <p className="mb-6 text-lg text-gray-200">
                Find and share the best culinary creations from around the world
              </p>
              
              {/* Search Section - Using enhanced SearchBar component */}
              <SearchBar onSearch={handleMealDBSearch} />
              
            </div>
          </div>
        </div>
      </section>

      {/* Category Section - Made collapsible on mobile */}
      <section className="container px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Explore <span className="text-amber-500">Dishes</span>
          </h2>
        </div>

      </section>

      {/* Recipes Grid Section */}
      <section className="container px-4 pb-12 mx-auto">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="w-12 h-12 rounded-full border-b-2 border-amber-500 animate-spin"></div>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard 
                key={recipe._id} 
                recipe={recipe}
                onDelete={handleDeleteRecipe}
                onAddToFavorites={handleAddToFavorites}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">No recipes found. Try a different search term or add your own recipe!</p>
            <Link 
              to="/addRecipe"
              className="inline-block px-6 py-2 mt-4 font-medium text-white bg-amber-500 rounded-lg transition-colors hover:bg-amber-600"
            >
              Add New Recipe
            </Link>
          </div>
        )}
      </section>
      
      {/* Indian Cuisine Section */}
      {indianCuisine.length > 0 && renderCuisineSection("Indian", indianCuisine, "🇮🇳")}
      
      {/* Italian Cuisine Section */}
      {italianCuisine.length > 0 && renderCuisineSection("Italian", italianCuisine, "🇮🇹")}
      
      {/* Global Recipes Recommendations */}
      <section className="py-12 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Global <span className="text-amber-500">Inspirations</span>
            </h2>
            <Link 
              to="/explore" 
              className="flex gap-1 items-center font-medium text-amber-600 hover:text-amber-700"
            >
              <span>Explore More</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          
          {loadingRecommendations ? (
            <div className="flex justify-center items-center p-12">
              <div className="w-12 h-12 rounded-full border-b-2 border-amber-500 animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {randomMeals.map((meal) => (
                <div key={meal.idMeal} className="overflow-hidden bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                  <div className="relative">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="object-cover w-full h-48"
                    />
                    <div className="absolute top-0 right-0 px-3 py-1 text-sm font-medium text-white bg-blue-500">
                      <div className="flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <span>{meal.strArea}</span>
                      </div>
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 p-4 bg-gradient-to-t to-transparent from-black/70">
                      <h3 className="text-lg font-bold text-white">{meal.strMeal}</h3>
                      <span className="text-sm text-gray-200">{meal.strCategory}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/meal/${meal.idMeal}`}
                        className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-amber-500 rounded transition-colors hover:bg-amber-600"
                      >
                        View Recipe
                      </Link>
                      <button
                        onClick={() => handleAddToFavorites(meal)}
                        className="p-2 text-white bg-gray-800 rounded transition-colors hover:bg-gray-900"
                        aria-label="Add to favorites"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      {meal.strYoutube && (
                        <a
                          href={meal.strYoutube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-white bg-red-500 rounded transition-colors hover:bg-red-600"
                          aria-label="Watch video"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Link
              to="/explore"
              className="inline-flex gap-2 items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
            >
              <Globe className="w-5 h-5" />
              <span>Explore Global Cuisines</span>
            </Link>
          </div>
        </div>
      </section>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Recipes;