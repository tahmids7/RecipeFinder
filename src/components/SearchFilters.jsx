import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SearchFilters({ onFilterChange }) {
  const cuisineTypes = [
    "African", "Asian", "American", "British", "Cajun", "Caribbean", "Chinese",
    "European", "French", "German", "Greek", "Indian", "Irish", "Italian",
    "Japanese", "Jewish", "Korean", "Latin American", "Mediterranean", "Mexican",
    "Middle Eastern", "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
  ];

  const dietaryRestrictions = [
    "Gluten Free", "Ketogenic", "Vegetarian", "Lacto-Vegetarian",
    "Ovo-Vegetarian", "Vegan", "Pescetarian", "Paleo", "Primal", "Low FODMAP",
    "Whole30"
  ];

  return (
    <div className="flex flex-wrap gap-4 w-full max-w-xl mx-auto mt-4">
      <div className="flex-1 min-w-[200px]">
        <Select onValueChange={(value) => onFilterChange('cuisine', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Cuisine Type" />
          </SelectTrigger>
          <SelectContent>
            {cuisineTypes.map((type) => (
              <SelectItem key={type.toLowerCase()} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <Select onValueChange={(value) => onFilterChange('diet', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Dietary Restriction" />
          </SelectTrigger>
          <SelectContent>
            {dietaryRestrictions.map((diet) => (
              <SelectItem key={diet.toLowerCase()} value={diet.toLowerCase()}>
                {diet}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
