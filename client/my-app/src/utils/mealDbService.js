// TheMealDB API Service
// Documentation: https://www.themealdb.com/api.php

const API_BASE_URL = process.env.REACT_APP_MEALDB_API_URL;

// Get a random meal
export const getRandomMeal = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals[0];
  } catch (error) {
    console.error('Error fetching random meal:', error);
    throw error;
  }
};

// Search meal by name
export const searchMealsByName = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching meals by name:', error);
    throw error;
  }
};

// Get meal by ID
export const getMealById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching meal by id:', error);
    throw error;
  }
};

// List all categories
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Filter by category
export const getMealsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    throw error;
  }
};

// List all areas (cuisines)
export const getAllAreas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

// Filter by area
export const getMealsByArea = async (area) => {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by area:', error);
    throw error;
  }
};

// Format TheMealDB data to match our app's recipe format
export const formatMealToRecipe = (meal) => {
  // Extract ingredients and measures from meal object
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim() !== '') {
      if (measure && measure.trim() !== '') {
        ingredients.push(`${measure.trim()} ${ingredient.trim()}`);
      } else {
        ingredients.push(ingredient.trim());
      }
    }
  }

  return {
    title: meal.strMeal,
    ingredients,
    instructions: meal.strInstructions,
    imageUrl: meal.strMealThumb,
    description: `${meal.strArea} ${meal.strCategory} dish. ${meal.strTags ? meal.strTags.replace(/,/g, ', ') : ''}`,
    cookTime: "30", // Default value since TheMealDB doesn't provide cooking time
    difficulty: "Medium", // Default value
    source: "TheMealDB",
    sourceId: meal.idMeal,
    area: meal.strArea,
    category: meal.strCategory,
    tags: meal.strTags,
    youtubeLink: meal.strYoutube
  };
};

/**
 * Search for meals by main ingredient
 * @param {string} ingredient - The main ingredient to search for
 * @returns {Promise<Array>} - Array of meals containing the ingredient
 */
export const searchMealsByIngredient = async (ingredient) => {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error("Error searching meals by ingredient:", error);
    return [];
  }
};

/**
 * Find meals by multiple ingredients
 * @param {Array<string>} ingredients - Array of ingredients
 * @returns {Promise<Array>} - Array of meals that match the most ingredients
 */
export const findMealsByIngredients = async (ingredients) => {
  if (!ingredients || ingredients.length === 0) return [];
  
  try {
    // Get results for each ingredient
    const ingredientPromises = ingredients.map(ingredient => 
      searchMealsByIngredient(ingredient)
    );
    
    const results = await Promise.all(ingredientPromises);
    
    // Create a map to count ingredient occurrences
    const mealCounts = {};
    const mealIds = new Set();
    
    results.forEach((meals, index) => {
      if (!meals) return;
      
      meals.forEach(meal => {
        const mealId = meal.idMeal;
        mealIds.add(mealId);
        
        if (!mealCounts[mealId]) {
          mealCounts[mealId] = {
            count: 1,
            meal: meal
          };
        } else {
          mealCounts[mealId].count += 1;
        }
      });
    });
    
    // Sort by count (number of matching ingredients)
    const sortedMeals = Object.values(mealCounts)
      .sort((a, b) => b.count - a.count)
      .map(item => item.meal);
    
    // Get full details for the top 5 results
    const detailPromises = sortedMeals.slice(0, 5).map(meal => 
      getMealById(meal.idMeal)
    );
    
    const detailedMeals = await Promise.all(detailPromises);
    return detailedMeals.filter(meal => meal !== null);
  } catch (error) {
    console.error("Error finding meals by ingredients:", error);
    return [];
  }
}; 