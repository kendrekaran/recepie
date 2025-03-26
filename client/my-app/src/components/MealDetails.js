import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Clock, Heart, BookOpen, Video, Globe, Tag, Share2 } from "lucide-react";
import { getMealById, formatMealToRecipe } from "../utils/mealDbService";

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealDetails = async () => {
      try {
        setLoading(true);
        const mealData = await getMealById(id);
        if (mealData) {
          setMeal(formatMealToRecipe(mealData));
        } else {
          toast.error("Recipe not found");
          navigate("/explore");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching meal details:", error);
        toast.error("Failed to load recipe details");
        setLoading(false);
        navigate("/explore");
      }
    };

    fetchMealDetails();
  }, [id, navigate]);

  const handleAddToFavorites = async () => {
    try {
      toast.info("Adding to favorites...");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/likedRecipes/${meal.sourceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
          body: JSON.stringify(meal),
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

  const handleShareRecipe = () => {
    if (navigator.share) {
      navigator.share({
        title: meal.title,
        text: `Check out this ${meal.area} ${meal.category} recipe: ${meal.title}`,
        url: window.location.href,
      })
      .then(() => toast.success("Shared successfully"))
      .catch((error) => console.error("Error sharing:", error));
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full border-b-2 border-amber-500 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-800">Recipe not found</p>
          <button
            onClick={() => navigate("/explore")}
            className="flex gap-2 items-center px-6 py-2 mx-auto mt-4 text-white bg-amber-500 rounded-lg transition-colors hover:bg-amber-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[40vh]">
        <img
          src={meal.imageUrl}
          alt={meal.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/70 via-black/30"></div>
        <button
          onClick={() => navigate("/explore")}
          className="absolute top-4 left-4 z-10 p-2 rounded-full transition-colors bg-white/80 hover:bg-white"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
      </div>

      <div className="container relative z-10 px-4 mx-auto -mt-20">
        <div className="overflow-hidden p-6 bg-white rounded-xl shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h1 className="mb-3 text-3xl font-bold text-gray-800">{meal.title}</h1>
            <div className="flex gap-2">
              <button
                onClick={handleAddToFavorites}
                className="flex gap-2 items-center px-4 py-2 text-white bg-gray-900 rounded-lg transition-colors hover:bg-gray-800"
              >
                <Heart className="w-4 h-4" />
                <span>Add to Favorites</span>
              </button>
              <button
                onClick={handleShareRecipe}
                className="flex gap-2 items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {meal.category && (
              <div className="flex items-center px-3 py-1 text-sm text-amber-800 bg-amber-100 rounded-full">
                <BookOpen className="mr-1 w-4 h-4" />
                <span>{meal.category}</span>
              </div>
            )}
            {meal.area && (
              <div className="flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                <Globe className="mr-1 w-4 h-4" />
                <span>{meal.area} Cuisine</span>
              </div>
            )}
            {meal.cookTime && (
              <div className="flex items-center px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
                <Clock className="mr-1 w-4 h-4" />
                <span>{meal.cookTime} min</span>
              </div>
            )}
            {meal.tags && (
              <div className="flex items-center px-3 py-1 text-sm text-green-800 bg-green-100 rounded-full">
                <Tag className="mr-1 w-4 h-4" />
                <span>{meal.tags}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Ingredients */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Ingredients</h2>
                <ul className="space-y-3">
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mt-2 mr-3 w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
                
                {meal.youtubeLink && (
                  <a
                    href={meal.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 justify-center items-center px-4 py-3 mt-6 w-full text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
                  >
                    <Video className="w-5 h-5" />
                    <span>Watch Video Tutorial</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Instructions */}
            <div className="lg:col-span-2">
              <h2 className="mb-4 text-xl font-bold text-gray-800">Instructions</h2>
              <div className="space-y-6">
                {meal.instructions.split('\r\n\r\n').filter(step => step.trim()).map((step, index) => (
                  <div key={index} className="p-5 bg-gray-50 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex flex-shrink-0 justify-center items-center mt-0.5 mr-3 w-6 h-6 text-sm font-bold text-white bg-amber-500 rounded-full">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              {meal.source === "TheMealDB" && (
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-500">
                    Recipe sourced from <a href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TheMealDB</a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default MealDetails; 