import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Bookmark, LogOut } from "lucide-react";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [searchParams, setSearchParams] = useState({ query: "", cuisine: "", diet: "" });
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const { data: recipes, isLoading } = useQuery({
    queryKey: [
      `/api/recipes/search?${new URLSearchParams(
        Object.fromEntries(
          Object.entries({
            query: searchParams.query,
            cuisine: searchParams.cuisine,
            diet: searchParams.diet
          }).filter(([_, value]) => value)
        )
      ).toString()}`
    ],
    enabled: !!searchParams.query,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["/api/favorites"],
  });

  const favoriteIds = favorites.map(f => f.recipeId);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Recipe Finder
            </h1>
            <div className="flex gap-2">
              <Link href="/favorites">
                <Button variant="outline" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Favorites
                </Button>
              </Link>
              <Button
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  try {
                    await logout();
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: error.message,
                    });
                  }
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            Welcome, <span className="font-semibold">{user?.username}</span>!
          </p>
        </div>

        <SearchBar onSearch={setSearchParams} />

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[300px] bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {recipes?.results && recipes.results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {recipes.results.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={{
                  id: recipe.id,
                  title: recipe.title,
                  image: recipe.image,
                  readyInMinutes: recipe.readyInMinutes,
                  servings: recipe.servings,
                  sourceUrl: recipe.sourceUrl,
                  summary: recipe.summary,
                }}
                isFavorite={favoriteIds.includes(recipe.id)}
              />
            ))}
          </div>
        ) : searchParams.query ? (
          <div className="text-center mt-20 text-gray-600">
            <p className="text-lg">No recipes found for "{searchParams.query}"</p>
            <p className="text-sm mt-2">Try a different search term</p>
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-600">
            <p className="text-lg">Search for recipes to get started!</p>
          </div>
        )}

        {!searchParams.query && (
          <div className="text-center mt-20 text-gray-600">
            <p className="text-lg">Search for recipes to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
