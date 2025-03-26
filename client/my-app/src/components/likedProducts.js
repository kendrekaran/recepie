import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash2, Clock, BookOpen, Globe, ExternalLink, Search, Filter, Tag } from "lucide-react";

const LikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cuisines, setCuisines] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Call the async function to fetch liked products when the component mounts
    fetchLikedRecipes();
  }, []);

  const fetchLikedRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/likedRecipes`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        toast.error("Failed to fetch favorite recipes");
      }

      const data = await response.json();

      // Set the fetched data to the state
      setLikedProducts(data);
      
      // Extract unique cuisines and categories
      const uniqueCuisines = [...new Set(data.map(recipe => recipe.area).filter(Boolean))];
      const uniqueCategories = [...new Set(data.map(recipe => recipe.category).filter(Boolean))];
      
      setCuisines(uniqueCuisines);
      setCategories(uniqueCategories);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching favorite recipes");
      console.error(error);
      setLoading(false);
    }
  };

  const handleUnlikeRecipe = async (recipeId) => {
    try {
      if (window.confirm("Are you sure you want to remove this recipe from favorites?")) {
        toast.info("Removing recipe...");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/removeLiked/${recipeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.ok) {
          toast.success("Recipe removed from favorites");
          // Update state directly instead of a full page reload
          setLikedProducts(likedProducts.filter(product => product._id !== recipeId));
        } else {
          const data = await response.json();
          toast.error(data.error || "Failed to remove recipe");
        }
      }
    } catch (error) {
      toast.error("Error removing recipe from favorites");
      console.error(error);
    }
  };
  
  // Filter likedProducts based on search term and filters
  const filteredProducts = likedProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = selectedCuisine === "All" || product.area === selectedCuisine;
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    
    return matchesSearch && matchesCuisine && matchesCategory;
  });

  return (
    <div className="pb-12 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[200px] overflow-hidden">
        <div className="absolute inset-0 z-10 bg-gradient-to-r to-transparent from-gray-900/80 via-gray-900/60"></div>
        <img
          src="https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=1776&auto=format&fit=crop"
          alt="Favorites"
          className="object-cover w-full h-full"
        />
        <div className="absolute right-0 left-0 top-1/2 z-20 transform -translate-y-1/2">
          <div className="container px-4 mx-auto">
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
              Your <span className="text-amber-400">Favorite</span> Recipes
            </h1>
            <p className="text-gray-200 md:max-w-md">
              All your saved culinary inspirations in one place
            </p>
          </div>
        </div>
      </section>
      
      <div className="container px-4 py-8 mx-auto">
        {/* Search and Filter Section */}
        <div className="p-4 mb-8 bg-white rounded-xl shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search your favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
            </div>
            
            {cuisines.length > 0 && (
              <div className="flex-shrink-0">
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="All">All Cuisines</option>
                  {cuisines.map(cuisine => (
                    <option key={cuisine} value={cuisine}>{cuisine}</option>
                  ))}
                </select>
              </div>
            )}
            
            {categories.length > 0 && (
              <div className="flex-shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="All">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* Favorites List */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="w-12 h-12 rounded-full border-b-2 border-amber-500 animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product._id} className="overflow-hidden bg-white rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="relative">
                  <img
                    src={product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                    alt={product.title}
                    className="object-cover w-full h-48"
                  />
                  {product.area && (
                    <div className="absolute top-0 right-0 px-3 py-1 text-sm font-medium text-white bg-blue-500">
                      <div className="flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <span>{product.area}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <h3 className="mb-2 text-xl font-bold text-gray-800">{product.title}</h3>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {product.category && (
                      <div className="flex items-center px-2 py-1 text-xs text-amber-800 bg-amber-100 rounded-full">
                        <BookOpen className="mr-1 w-3 h-3" />
                        <span>{product.category}</span>
                      </div>
                    )}
                    {product.cookTime && (
                      <div className="flex items-center px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded-full">
                        <Clock className="mr-1 w-3 h-3" />
                        <span>{product.cookTime} min</span>
                      </div>
                    )}
                    {product.tags && (
                      <div className="flex items-center px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                        <Tag className="mr-1 w-3 h-3" />
                        <span>{product.tags.split(',')[0]}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                    {product.description || "A delicious recipe saved to your favorites."}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-xs text-gray-600">
                      <strong>Ingredients:</strong>
                      <p className="line-clamp-2">
                        {product.ingredients.slice(0, 3).join(', ')}
                        {product.ingredients.length > 3 && '...'}
                      </p>
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Source:</strong>
                      <p>{product.source || "Custom Recipe"}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    {product.sourceId ? (
                      <Link
                        to={`/meal/${product.sourceId}`}
                        className="flex-1 px-3 py-2 text-sm font-medium text-center text-white bg-amber-500 rounded-lg transition-colors hover:bg-amber-600"
                      >
                        View Recipe
                      </Link>
                    ) : (
                      <button
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg transition-colors hover:bg-amber-600"
                        onClick={() => toast.info("Detailed view coming soon!")}
                      >
                        View Recipe
                      </button>
                    )}
                    <button
                      onClick={() => handleUnlikeRecipe(product._id)}
                      className="p-2 text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {product.youtubeLink && (
                      <a
                        href={product.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-white bg-red-600 rounded-lg transition-colors hover:bg-red-700"
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
        ) : (
          <div className="p-8 mx-auto max-w-lg text-center bg-white rounded-xl">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/1996/1996055.png" 
              alt="No favorites" 
              className="mx-auto mb-4 w-24 h-24 opacity-70"
            />
            <h2 className="mb-2 text-2xl font-bold text-gray-800">No Favorites Found</h2>
            <p className="mb-6 text-gray-600">
              {searchTerm || selectedCuisine !== "All" || selectedCategory !== "All" 
                ? "Try adjusting your search or filters." 
                : "Start adding recipes to your favorites to see them here."}
            </p>
            <Link 
              to="/explore"
              className="inline-block px-6 py-2 text-white bg-amber-500 rounded-lg transition-colors hover:bg-amber-600"
            >
              Explore Recipes
            </Link>
          </div>
        )}
      </div>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default LikedProducts;
