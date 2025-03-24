const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the Gemini API with the provided API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to get recipe from Gemini
const getRecipeFromGemini = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: "Ingredients are required" });
    }

    // Join ingredients with commas
    const ingredientsList = ingredients.join(", ");

    // Create a prompt for Gemini
    const prompt = `Generate a detailed recipe that can be made with these ingredients: ${ingredientsList}.
    
    Format the response as a structured JSON object with these fields:
    - strMeal: The name of the dish
    - strCategory: The category of the dish (e.g., Vegetarian, Seafood, etc.)
    - strArea: The cuisine of origin
    - strInstructions: Detailed cooking instructions
    - strMealThumb: Leave blank, I'll handle the image
    - strYoutube: Leave blank
    - strIngredients: An array of all ingredients needed (including the ones provided)
    - strMeasurements: An array of measurements corresponding to each ingredient
    - strTags: Comma-separated tags for the recipe (e.g., "Vegetarian,Spicy,Quick")
    
    Please ensure the recipe is realistic, makes good use of the provided ingredients, and includes clear, step-by-step instructions.`;

    // Configure Gemini model - using the updated model name and configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 1,
        topK: 32,
        maxOutputTokens: 4096,
      },
    });

    // Generate content with proper generation setup
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const response = result.response;
    const text = response.text();

    // Extract JSON from the response
    let recipeData;
    try {
      // Try to parse directly if the response is a clean JSON
      recipeData = JSON.parse(text);
    } catch (e) {
      // If direct parsing fails, try to extract JSON using regex
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                        text.match(/```\n([\s\S]*?)\n```/) ||
                        text.match(/{[\s\S]*?}/);
                        
      if (jsonMatch) {
        try {
          recipeData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (err) {
          console.error("Error parsing extracted JSON:", err);
          // If JSON parsing fails, create a structured recipe from the text response
          recipeData = createStructuredRecipe(text, ingredients);
        }
      } else {
        // Fallback if no JSON structure was found
        recipeData = createStructuredRecipe(text, ingredients);
      }
    }

    // Add a placeholder image if none was provided
    if (!recipeData.strMealThumb) {
      recipeData.strMealThumb = "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D";
    }

    // Add a source flag to indicate this came from Gemini
    recipeData.source = "gemini";

    return res.status(200).json(recipeData);
  } catch (error) {
    console.error("Error getting recipe from Gemini:", error);
    // Create a fallback recipe in case of API error
    const fallbackRecipe = createFallbackRecipe(ingredients);
    return res.status(200).json(fallbackRecipe);
  }
};

// Helper function to create a structured recipe from text
const createStructuredRecipe = (text, ingredients) => {
  // Try to extract recipe name from the text
  let recipeName = "Recipe";
  const titleMatch = text.match(/recipe for ["\']?(.*?)["\']?[\n:\.]/i) || 
                     text.match(/["\']?(.*?)["\']? recipe/i) ||
                     text.match(/dish ["\']?(.*?)["\']?[\n:\.]/i);
  
  if (titleMatch && titleMatch[1]) {
    recipeName = titleMatch[1].trim();
  } else if (ingredients && ingredients.length > 0) {
    recipeName = `${ingredients[0].charAt(0).toUpperCase() + ingredients[0].slice(1)} Recipe`;
  }
  
  return {
    strMeal: recipeName,
    strCategory: "Mixed",
    strArea: "Fusion",
    strInstructions: text,
    strIngredients: ingredients,
    strMeasurements: Array(ingredients.length).fill("to taste"),
    strTags: "AI Generated",
    strMealThumb: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    source: "gemini"
  };
};

// Helper function to create a fallback recipe when the API fails
const createFallbackRecipe = (ingredients) => {
  const mainIngredient = ingredients[0] || "food";
  return {
    strMeal: `${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Special`,
    strCategory: "Mixed",
    strArea: "International",
    strInstructions: `This is a simple recipe using ${ingredients.join(', ')}.\n\n1. Gather all ingredients.\n2. Prepare ${ingredients[0]} by washing and cutting as needed.\n3. Combine with other ingredients.\n4. Cook until done.\n5. Serve and enjoy!`,
    strIngredients: ingredients,
    strMeasurements: Array(ingredients.length).fill("to taste"),
    strTags: "Simple,Quick,Easy",
    strMealThumb: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D",
    source: "gemini"
  };
};

module.exports = {
  getRecipeFromGemini,
}; 