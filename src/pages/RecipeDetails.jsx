import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function RecipeDetails() {
  const [, params] = useRoute("/recipe/:id");

  const { data: recipe, isLoading } = useQuery({
    queryKey: [`/api/recipes/${params.id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-[400px] bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to search
          </Button>
        </Link>

        <Card>
          <CardContent className="p-6">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-[400px] object-cover rounded-lg mb-6"
            />

            <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <span>{recipe.readyInMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-600" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {recipe.extendedIngredients?.map((ingredient) => (
                    <li key={ingredient.id}>{ingredient.original}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Instructions</h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
