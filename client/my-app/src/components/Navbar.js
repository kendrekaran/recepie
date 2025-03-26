import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Plus, Heart, LogOut, Menu, X, Globe } from "lucide-react";
import "../App.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const auth = localStorage.getItem("token");

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const LogoutUser = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const navigation = [
    { name: "Home", to: "/recipes" },
    { name: "Explore", to: "/explore" },
    { name: "Ingredient Search", to: "/ingredient-search" },
    { name: "Saved AI Recipes", to: "/saved-ai-recipes" },
    { name: "Favorites", to: "/favouriteRecipes" },
    { name: "Add Recipe", to: "/addRecipe" },
    { name: "Feedback", to: "/feedback" },
  ];

  return (
    <header className={`sticky top-0 bg-white z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container px-4 py-4 mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/recipes" className="flex-shrink-0 text-2xl font-bold">
            <span className="text-black">FLA</span>
            <span className="text-amber-500">VORIZ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-grow justify-center items-center mx-4 space-x-6 md:flex lg:space-x-8">
            {auth && (
              <>
                <NavLink to="/recipes" label="HOME" />
                <NavLink to="/explore" label="EXPLORE" />
                <NavLink to="/ingredient-search" label="INGREDIENT SEARCH" />
                <NavLink to="/saved-ai-recipes" label="SAVED AI RECIPES" />
                <NavLink to="/addRecipe" label="ADD RECIPE" />
                <NavLink to="/favouriteRecipes" label="FAVORITES" />
                <NavLink to="/feedback" label="FEEDBACK" />
              </>
            )}
          </nav>

          {/* Search and Actions */}
          <div className="flex gap-3 items-center md:gap-4">

            {/* User Actions */}
            <div className="flex gap-2 items-center">
              {auth ? (
                <>
                  <Link 
                    to="/explore" 
                    className="p-2 text-white bg-blue-500 rounded-full transition-colors hover:bg-blue-600 md:hidden"
                    aria-label="Explore Recipes"
                  >
                    <Globe className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/addRecipe" 
                    className="p-2 text-white bg-amber-500 rounded-full transition-colors hover:bg-amber-600 md:hidden"
                    aria-label="Add Recipe"
                  >
                    <Plus className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/favouriteRecipes" 
                    className="p-2 text-gray-800 bg-gray-200 rounded-full transition-colors hover:bg-gray-300 md:hidden"
                    aria-label="Favorites"
                  >
                    <Heart className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={LogoutUser}
                    className="p-2 text-white bg-gray-900 rounded-full transition-colors hover:bg-gray-800"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login">
                  <button 
                    className="p-2 text-white bg-gray-900 rounded-full transition-colors hover:bg-gray-800"
                    aria-label="Login"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button 
                className="p-2 ml-1 rounded-full transition-colors md:hidden hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="py-3 mt-4 border-t border-gray-100 md:hidden animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">HOME</Link>
              <Link to="/recipes" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">RECIPES</Link>
              <Link to="/ingredient-search" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">INGREDIENT SEARCH</Link>
              <Link to="/saved-ai-recipes" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">SAVED AI RECIPES</Link>
              {auth ? (
                <>
                  <Link to="/explore" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">EXPLORE GLOBAL RECIPES</Link>
                  <Link to="/addRecipe" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">ADD RECIPE</Link>
                  <Link to="/favouriteRecipes" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">FAVORITES</Link>
                  <Link to="/feedback" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">FEEDBACK</Link>
                  <button 
                    onClick={LogoutUser} 
                    className="py-2 font-medium text-left text-red-500 transition-colors hover:text-red-700"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">LOGIN</Link>
                  <Link to="/signup" className="py-2 font-medium text-gray-700 transition-colors hover:text-amber-500">SIGNUP</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// NavLink component for consistent styling
const NavLink = ({ to, label, active }) => (
  <Link 
    to={to} 
    className={`relative font-medium ${active ? 'text-amber-500' : 'text-gray-700 hover:text-amber-500'} transition-colors group`}
  >
    {label}
    <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full ${active ? 'w-full' : ''}`}></span>
  </Link>
);

export default Navbar;