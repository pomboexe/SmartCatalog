import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../features/auth/AuthContext";
import { ProductCard } from "../features/products/ProductCard";
import { ProductFilters } from "../features/products/ProductFilters";
import { ProductForm } from "../features/products/ProductForm";
import { UserProductsView } from "../features/products/UserProductsView";
import { useProductFilters } from "../features/products/useProductFilters";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../features/products/useProducts";
import { ApiError } from "../services/api";
import type { CreateProductInput, Product } from "../types";

export function DashboardPage() {
  const { isAdmin } = useAuth();
  const { data: products, isLoading, error, isFetching } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);

  const catalog = products ?? [];
  const {
    search,
    setSearch,
    category,
    setCategory,
    categories,
    filteredProducts,
    hasActiveFilters,
    clearFilters,
  } = useProductFilters(catalog);

  const showForm = isCreating || Boolean(editing);
  const formPending = createProduct.isPending || updateProduct.isPending;
  const formError = isCreating
    ? createProduct.error
    : editing
      ? updateProduct.error
      : null;

  useEffect(() => {
    if (!showForm) return;

    const frame = requestAnimationFrame(() => {
      formPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [showForm, editing?._id, isCreating]);

  function closeForm() {
    setIsCreating(false);
    setEditing(null);
    createProduct.reset();
    updateProduct.reset();
  }

  function openCreate() {
    setEditing(null);
    updateProduct.reset();
    createProduct.reset();
    setIsCreating(true);
  }

  function openEdit(product: Product) {
    setIsCreating(false);
    createProduct.reset();
    updateProduct.reset();
    setEditing(product);
  }

  function handleSubmit(input: CreateProductInput) {
    if (editing) {
      updateProduct.mutate(
        { id: editing._id, input },
        {
          onSuccess: () => {
            closeForm();
          },
        },
      );
      return;
    }

    createProduct.mutate(input, {
      onSuccess: () => {
        closeForm();
      },
    });
  }

  function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Excluir o produto "${product.name}"? Essa ação não pode ser desfeita.`,
    );

    if (!confirmed) return;

    deleteProduct.mutate(product._id);
  }

  const listErrorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Falha ao carregar produtos"
        : "";

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-ink/8 bg-surface-muted p-8 text-sm text-ink-soft/75">
        Carregando produtos...
      </div>
    );
  }

  if (listErrorMessage) {
    return (
      <div className="rounded-2xl border border-coral/20 bg-coral/10 p-4 text-sm text-coral">
        {listErrorMessage}
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <UserProductsView products={catalog} isFetching={isFetching} />
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">
            Produtos
          </h1>
          <p className="mt-1 text-ink-soft/75">
            Catálogo da sua empresa — você pode criar, editar e excluir.
            {isFetching ? " · atualizando..." : null}
          </p>
        </div>

        {!showForm ? (
          <Button type="button" onClick={openCreate}>
            Novo produto
          </Button>
        ) : null}
      </div>

      {showForm ? (
        <div ref={formPanelRef} className="scroll-mt-6">
          <ProductForm
            initialProduct={editing}
            isPending={formPending}
            error={formError}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </div>
      ) : null}

      {catalog.length > 0 ? (
        <ProductFilters
          search={search}
          category={category}
          categories={categories}
          resultCount={filteredProducts.length}
          categoryCount={categories.length}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
        />
      ) : null}

      {catalog.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-surface-soft p-8 text-center">
          <p className="font-display text-lg font-bold text-ink">
            Nenhum produto ainda
          </p>
          <p className="mt-1 text-sm text-ink-soft/75">
            Clique em “Novo produto” para popular o catálogo.
          </p>
        </div>
      ) : null}

      {catalog.length > 0 && filteredProducts.length === 0 ? (
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
              isAdmin
              onEdit={openEdit}
              onDelete={handleDelete}
              isDeleting={
                deleteProduct.isPending &&
                deleteProduct.variables === product._id
              }
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
