import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Globe, Utensils, Search, ChevronRight, RefreshCw, Heart, ExternalLink } from "lucide-react";
import {
  getAllCategories,
  getAllAreas,
  getMealsByCategory,
  getMealsByArea,
  getRandomMeal,
  formatMealToRecipe,
  getMealById
} from "../utils/mealDbService";

const ExploreRecipes = () => {
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [activeTab, setActiveTab] = useState("categories");
  const [loading, setLoading] = useState(true);
  const [meals, setMeals] = useState([]);
  const [randomMeal, setRandomMeal] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [loadingRandom, setLoadingRandom] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch categories and set the first one as selected
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].strCategory);
          const categoryMeals = await getMealsByCategory(categoriesData[0].strCategory);
          setMeals(categoryMeals);
        }

        // Fetch areas data
        const areasData = await getAllAreas();
        setAreas(areasData);

        // Fetch a random meal
        await fetchRandomMeal();
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load recipe data");
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchRandomMeal = async () => {
    try {
      setLoadingRandom(true);
      const meal = await getRandomMeal();
      setRandomMeal(formatMealToRecipe(meal));
      setLoadingRandom(false);
    } catch (error) {
      console.error("Error fetching random meal:", error);
      setLoadingRandom(false);
    }
  };

  const handleCategoryClick = async (category) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      setSelectedArea("");
      const categoryMeals = await getMealsByCategory(category);
      setMeals(categoryMeals);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching category meals:", error);
      toast.error("Failed to load category recipes");
      setLoading(false);
    }
  };

  const handleAreaClick = async (area) => {
    try {
      setLoading(true);
      setSelectedArea(area);
      setSelectedCategory("");
      const areaMeals = await getMealsByArea(area);
      setMeals(areaMeals);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching area meals:", error);
      toast.error("Failed to load cuisine recipes");
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (meal) => {
    try {
      toast.info("Adding to favorites...");
      
      // If the meal doesn't have instructions (likely from a list/filter endpoint),
      // we need to fetch complete meal details first
      let completeData = meal;
      if (!meal.strInstructions) {
        const completeDataResponse = await getMealById(meal.idMeal);
        if (!completeDataResponse) {
          toast.error("Could not fetch complete recipe details");
          return;
        }
        completeData = completeDataResponse;
      }
      
      // Format to our recipe format
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
        toast.success("Recipe added to favorites");
      } else {
        const data = await response.json();
        if (data.error === "Recipe already exists in your favorites") {
          toast.warn("Recipe already exists in your favorites");
        } else {
          toast.error(data.error || "Failed to add to favorites");
        }
      }
    } catch (error) {
      toast.error("An error occurred while adding to favorites");
      console.error(error);
    }
  };

  return (
    <div className="pb-12 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[250px] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-r to-transparent from-gray-900/80 via-gray-900/60"></div>
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop"
          alt="World cuisines"
          className="object-cover w-full h-full"
        />
        <div className="absolute left-4 top-1/2 z-20 transform -translate-y-1/2 sm:left-12">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
            Explore <span className="text-amber-400">Global</span> Cuisines
          </h1>
          <p className="text-gray-200 md:max-w-md">
            Discover recipes from around the world through TheMealDB
          </p>
        </div>
      </section>

      <div className="container relative z-20 px-4 mx-auto -mt-6">
        {/* Random Recipe Card */}
        {randomMeal && (
          <div className="overflow-hidden mb-8 bg-white rounded-xl shadow-md">
            <div className="sm:flex">
              <div className="h-64 sm:w-1/3 sm:h-auto">
                <img 
                  src={randomMeal.imageUrl} 
                  alt={randomMeal.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6 sm:w-2/3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-gray-800">{randomMeal.title}</h2>
                    <div className="flex gap-2 items-center mb-3 text-sm text-gray-600">
                      <span className="px-2 py-1 text-amber-800 bg-amber-100 rounded-full">{randomMeal.category}</span>
                      <span className="px-2 py-1 text-blue-800 bg-blue-100 rounded-full">{randomMeal.area} Cuisine</span>
                    </div>
                  </div>
                  <button 
                    onClick={fetchRandomMeal}
                    disabled={loadingRandom}
                    className="p-2 bg-gray-100 rounded-full transition-colors hover:bg-gray-200"
                  >
                    <RefreshCw className={`h-5 w-5 text-gray-600 ${loadingRandom ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                
                <p className="mb-4 text-gray-600 line-clamp-2">{randomMeal.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {randomMeal.ingredients.slice(0, 5).map((ingredient, idx) => (
                    <span key={idx} className="px-2 py-1 text-sm text-gray-800 bg-gray-100 rounded">{ingredient}</span>
                  ))}
                  {randomMeal.ingredients.length > 5 && (
                    <span className="text-sm text-gray-500">+{randomMeal.ingredients.length - 5} more</span>
                  )}
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Link
                    to={`/meal/${randomMeal.sourceId}`}
                    className="flex gap-2 items-center px-4 py-2 text-white bg-amber-500 rounded-lg transition-colors hover:bg-amber-600"
                  >
                    <span>View Recipe</span>
                  </Link>
                  <button
                    onClick={() => handleAddToFavorites(randomMeal)}
                    className="flex gap-2 items-center px-4 py-2 text-white bg-gray-800 rounded-lg transition-colors hover:bg-gray-900"
                  >
                    <Heart className="w-4 h-4" />
                    <span>Favorite</span>
                  </button>
                  {randomMeal.youtubeLink && (
                    <a
                      href={randomMeal.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-2 items-center px-4 py-2 text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Watch Video</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="overflow-hidden bg-white rounded-xl shadow-md">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "categories"
                  ? "text-amber-600 border-b-2 border-amber-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              <div className="flex gap-2 justify-center items-center">
                <Utensils className="w-5 h-5" />
                <span>Categories</span>
              </div>
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "cuisines"
                  ? "text-amber-600 border-b-2 border-amber-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("cuisines")}
            >
              <div className="flex gap-2 justify-center items-center">
                <Globe className="w-5 h-5" />
                <span>Cuisines</span>
              </div>
            </button>
          </div>

          <div className="p-6">
            {/* Categories Content */}
            {activeTab === "categories" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category.idCategory}
                      onClick={() => handleCategoryClick(category.strCategory)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.strCategory
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {category.strCategory}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cuisines Content */}
            {activeTab === "cuisines" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {areas.map((area) => (
                    <button
                      key={area.strArea}
                      onClick={() => handleAreaClick(area.strArea)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedArea === area.strArea
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {area.strArea}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Grid */}
            {loading ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-12 h-12 rounded-full border-b-2 border-amber-500 animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading recipes...</p>
              </div>
            ) : (
              <>
                <h3 className="mb-4 text-lg font-medium text-gray-800">
                  {selectedCategory && `${selectedCategory} Recipes`}
                  {selectedArea && `${selectedArea} Cuisine Recipes`}
                </h3>
                
                {meals.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-gray-600">No recipes found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {meals.map((meal) => (
                      <div key={meal.idMeal} className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
                        <div className="relative h-48">
                          <img
                            src={meal.strMealThumb}
                            alt={meal.strMeal}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="mb-2 font-medium text-gray-800 line-clamp-1">{meal.strMeal}</h3>
                          <div className="flex gap-2">
                            <Link
                              to={`/meal/${meal.idMeal}`}
                              className="flex-1 px-4 py-2 text-sm font-medium text-center text-white bg-amber-500 rounded transition-colors hover:bg-amber-600"
                            >
                              View Recipe
                            </Link>
                            <button
                              onClick={() => handleAddToFavorites(meal)}
                              className="flex justify-center items-center p-2 text-white bg-gray-800 rounded transition-colors hover:bg-gray-900"
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
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default ExploreRecipes; 