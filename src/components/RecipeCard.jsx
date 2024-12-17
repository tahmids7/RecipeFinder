import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";

export default function RecipeCard({ recipe, isFavorite }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await fetch(`/api/favorites/${recipe.id}`, { method: "DELETE" });
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recipe),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        duration: 2000,
      });
    },
  });

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="cursor-pointer" onClick={() => window.location.href = `/recipe/${recipe.id}`}>
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {recipe.readyInMinutes && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {recipe.readyInMinutes}min
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {recipe.servings} servings
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant={isFavorite ? "destructive" : "secondary"}
          size="sm"
          onClick={() => toggleFavorite.mutate()}
          className="ml-auto"
        >
          <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
          {isFavorite ? "Remove" : "Save"}
        </Button>
      </CardFooter>
    </Card>
  );
}
