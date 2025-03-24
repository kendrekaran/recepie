import React, { useState, useEffect } from 'react';
import "../styles/Searchbar.css";
import { Search, X, Loader2 } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  const searchMealDB = async (query) => {
    if (!query.trim()) {
      onSearch([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      const meals = data.meals || [];
      onSearch(meals);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      onSearch([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSearch = (value) => {
    setSearchTerm(value);
    
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set a new timeout to delay the API call until the user stops typing
    const timeout = setTimeout(() => {
      searchMealDB(value);
    }, 500);
    
    setTypingTimeout(timeout);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    onSearch([]);
  };
  
  useEffect(() => {
    // Clean up the timeout on component unmount
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);
  
  return (
    <div className="search-container">
      <div className="search-bar">
        <div className="search-icon-container">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {isLoading ? (
          <div className="flex justify-center items-center p-3 mr-1 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
          </div>
        ) : searchTerm && (
          <div onClick={clearSearch} className="flex justify-center items-center p-3 mr-1 text-gray-400 cursor-pointer hover:text-gray-600">
            <X size={20} />
          </div>
        )}
      </div>
      {isLoading && (
        <div className="loading-indicator">
          <Loader2 className="mr-2 animate-spin" size={16} />
          Searching in MealDB...
        </div>
      )}
    </div>
  );
};

export default SearchBar;

