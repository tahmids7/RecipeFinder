import { useQuery } from "@tanstack/react-query";
import RecipeCard from "../components/RecipeCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Favorites() {
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["/api/favorites"],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Favorite Recipes
        </h1>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(recipe => (
              <RecipeCard
                key={recipe.recipeId}
                recipe={{
                  ...recipe.recipeData,
                  id: recipe.recipeId,
                }}
                isFavorite={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-600">
            <p className="text-lg">No favorite recipes yet!</p>
            <p className="mt-2">
              Go back to search and save some recipes you like.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
