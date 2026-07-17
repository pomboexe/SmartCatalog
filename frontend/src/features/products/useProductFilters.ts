import { useMemo, useState } from "react";
import type { Product } from "../../types";

export function useProductFilters(products: Product[]) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => product.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const hasActiveFilters = search.trim() !== "" || category !== "all";

  function clearFilters() {
    setSearch("");
    setCategory("all");
  }

  return {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    filteredProducts,
    hasActiveFilters,
    clearFilters,
  };
}
