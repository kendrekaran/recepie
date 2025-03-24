import "./App.css";
import Login from "./components/Login";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import PrivateComponent from "./components/PrivateComponent";
import Recipes from "./components/Recipes";
import AddRecipe from "./components/AddRecipe";
import LikedProducts from "./components/likedProducts";
import ForgotPassword from "./components/ForgotPassword";
import FeedbackPage from "./components/FeedbackPage";
import ExploreRecipes from "./components/ExploreRecipes";
import MealDetails from "./components/MealDetails";
import IngredientSearch from "./components/IngredientSearch";
import GeminiRecipeDetails from "./components/GeminiRecipeDetails";
import SavedGeminiRecipes from "./components/SavedGeminiRecipes";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />

          <Route element={<PrivateComponent />}>
            <Route path="/favouriteRecipes" element={<LikedProducts />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/" element={<Recipes />} />
            <Route path="/addRecipe" element={<AddRecipe />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/explore" element={<ExploreRecipes />} />
            <Route path="/meal/:id" element={<MealDetails />} />
            <Route path="/ingredient-search" element={<IngredientSearch />} />
            <Route path="/gemini-recipe" element={<GeminiRecipeDetails />} />
            <Route path="/saved-ai-recipes" element={<SavedGeminiRecipes />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
