/**
 * Get recipe suggestions from Gemini API based on ingredients
 * @param {Array<string>} ingredients - List of ingredients
 * @returns {Promise<Object>} - Recipe data in MealDB format
 */
export const getRecipeFromGemini = async (ingredients) => {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }
  
  try {
    // Use environment variables for API URL
    const apiUrl = `${process.env.REACT_APP_API_URL}/gemini/recipe`;
    
    // Set a timeout for the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ingredients }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate that the response has the required fields
    if (!data || !data.strMeal || !data.strInstructions) {
      throw new Error('Received invalid recipe data');
    }
    
    return data;
  } catch (error) {
    console.error("Error getting recipe from Gemini:", error);
    
    // Create a fallback recipe in case of API error
    const mainIngredient = ingredients[0] || 'food';
    return {
      strMeal: `${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Dish`,
      strCategory: "Mixed",
      strArea: "International",
      strInstructions: `This is a simple recipe using ${ingredients.join(', ')}.\n\n1. Gather all ingredients.\n2. Prepare ${ingredients[0]} by washing and cutting as needed.\n3. Combine with other ingredients.\n4. Cook until done.\n5. Serve and enjoy!`,
      strIngredients: ingredients,
      strMeasurements: Array(ingredients.length).fill("to taste"),
      strTags: "Simple,Quick,Easy",
      strMealThumb: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
      source: "gemini"
    };
  }
}; 