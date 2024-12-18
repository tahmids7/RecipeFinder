import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import SearchFilters from "./SearchFilters";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    cuisine: "",
    diet: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeFilters = {
      query,
      ...(filters.cuisine && { cuisine: filters.cuisine }),
      ...(filters.diet && { diet: filters.diet })
    };
    onSearch(activeFilters);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    if (query) {
      onSearch({
        query,
        ...(filterType === 'cuisine' ? { cuisine: value } : { cuisine: filters.cuisine }),
        ...(filterType === 'diet' ? { diet: value } : { diet: filters.diet })
      });
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
      <SearchFilters onFilterChange={handleFilterChange} />
    </div>
  );
}
