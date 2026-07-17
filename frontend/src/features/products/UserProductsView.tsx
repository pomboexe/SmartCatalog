import { Button } from "../../components/ui/Button";
import { useChatPanel } from "../chat/ChatContext";
import type { Product } from "../../types";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";
import { useProductFilters } from "./useProductFilters";

type UserProductsViewProps = {
  products: Product[];
  isFetching?: boolean;
};

export function UserProductsView({
  products,
  isFetching = false,
}: UserProductsViewProps) {
  const { open } = useChatPanel();
  const {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    filteredProducts,
    hasActiveFilters,
    clearFilters,
  } = useProductFilters(products);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Catálogo
          </h1>
          <p className="mt-1 text-ink-soft/75">
            Explore os produtos da sua empresa e pergunte à IA quando precisar
            de recomendações.
            {isFetching ? " · atualizando..." : null}
          </p>
        </div>

        <Button type="button" onClick={open}>
          Perguntar para a IA
        </Button>
      </div>

      <ProductFilters
        search={search}
        category={category}
        categories={categories}
        resultCount={filteredProducts.length}
        categoryCount={categories.length}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-surface-soft p-8 text-center">
          <p className="font-display text-lg font-bold text-ink">
            Nenhum produto ainda
          </p>
          <p className="mt-1 text-sm text-ink-soft/75">
            Peça a um admin para cadastrar itens no catálogo.
          </p>
        </div>
      ) : null}

      {products.length > 0 && filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-surface-soft p-8 text-center">
          <p className="font-display text-lg font-bold text-ink">
            Nenhum resultado
          </p>
          <p className="mt-1 text-sm text-ink-soft/75">
            Tente outro termo ou limpe os filtros.
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              className="mt-4 text-sm font-semibold text-teal underline-offset-4 hover:underline"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
      ) : null}

      {filteredProducts.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isAdmin={false}
              onEdit={() => undefined}
              onDelete={() => undefined}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
