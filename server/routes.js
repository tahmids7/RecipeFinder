import { createServer } from "http";
import { db } from "../db/index.js";
import { favorites } from "../db/schema.js";
import { eq } from "drizzle-orm";

export function registerRoutes(app) {
  const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
  const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";

  // Search recipes
  app.get("/api/recipes/search", async (req, res) => {
    const { query, cuisine, diet } = req.query;
    try {
      console.log("Searching recipes with query:", query, "cuisine:", cuisine, "diet:", diet);
      const searchParams = new URLSearchParams();
      
    
      searchParams.append('apiKey', SPOONACULAR_API_KEY);
      searchParams.append('number', '12');
      searchParams.append('addRecipeInformation', 'true');
      searchParams.append('fillIngredients', 'true');
      searchParams.append('instructionsRequired', 'true');

      if (query && query.trim()) {
        searchParams.append('query', query.trim());
      }

      if (cuisine && cuisine.trim()) {
        searchParams.append('cuisine', cuisine.trim());
      }

      if (diet && diet.trim()) {
        searchParams.append('diet', diet.trim());
      }

      const url = `${SPOONACULAR_BASE_URL}/complexSearch?${searchParams}`;
      console.log("Fetching from:", url.replace(SPOONACULAR_API_KEY, "API_KEY"));
      console.log("Applied filters - Cuisine:", cuisine || 'none', "Diet:", diet || 'none');
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}: ${await response.text()}`);
      }
      const data = await response.json();
      console.log("API Response results count:", data.results?.length);
      res.json(data);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ error: "Failed to fetch recipes: " + error.message });
    }
  });

  // Get recipe details
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const searchParams = new URLSearchParams({
        apiKey: SPOONACULAR_API_KEY,
      });
      
      console.log("Fetching recipe details for ID:", req.params.id);
      const url = `${SPOONACULAR_BASE_URL}/${req.params.id}/information?${searchParams}`;
      console.log("Fetching from:", url.replace(SPOONACULAR_API_KEY, "API_KEY"));
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      console.log("Recipe details received:", data.title);
      res.json(data);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      res.status(500).json({ error: "Failed to fetch recipe details: " + error.message });
    }
  });

  // Get user favorites
  app.get("/api/favorites", async (req, res) => {
    try {
      const userFavorites = await db.query.favorites.findMany({
        where: eq(favorites.userId, 1), 
      });
      res.json(userFavorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  // Add to favorites
  app.post("/api/favorites", async (req, res) => {
    try {
      const recipe = req.body;
      await db.insert(favorites).values({
        userId: 1, 
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        cookTime: recipe.readyInMinutes,
        servings: recipe.servings,
        recipeData: recipe,
      });
      res.json({ message: "Added to favorites" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add to favorites" });
    }
  });

  // Remove from favorites
  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      await db.delete(favorites).where(eq(favorites.recipeId, parseInt(req.params.id)));
      res.json({ message: "Removed from favorites" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from favorites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
