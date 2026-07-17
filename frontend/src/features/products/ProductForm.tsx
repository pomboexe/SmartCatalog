import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ApiError } from "../../services/api";
import type { CreateProductInput, Product } from "../../types";

type ProductFormProps = {
  initialProduct?: Product | null;
  isPending: boolean;
  error: Error | null;
  onSubmit: (input: CreateProductInput) => void;
  onCancel: () => void;
};

const emptyForm: CreateProductInput = {
  name: "",
  description: "",
  price: 0,
  category: "",
  imageUrl: "",
};

export function ProductForm({
  initialProduct,
  isPending,
  error,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [form, setForm] = useState<CreateProductInput>(emptyForm);

  useEffect(() => {
    if (initialProduct) {
      setForm({
        name: initialProduct.name,
        description: initialProduct.description,
        price: initialProduct.price,
        category: initialProduct.category,
        imageUrl: initialProduct.imageUrl,
      });
      return;
    }

    setForm(emptyForm);
  }, [initialProduct]);

  function updateField<K extends keyof CreateProductInput>(
    key: K,
    value: CreateProductInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
    });
  }

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : error
        ? "Falha ao salvar produto"
        : "";

  const isEditing = Boolean(initialProduct);

  return (
    <section className="rounded-2xl border border-ink/8 bg-surface-muted p-6 shadow-[0_16px_40px_-28px_var(--shadow-panel)] backdrop-blur-sm">
      <div className="mb-5">
        <h2 className="font-display text-xl font-bold tracking-tight text-ink">
          {isEditing ? "Editar produto" : "Novo produto"}
        </h2>
        <p className="mt-1 text-sm text-ink-soft/75">
          {isEditing
            ? "Atualize os dados do produto do catálogo."
            : "Preencha os campos para adicionar um item ao catálogo."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nome"
          name="name"
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
          required
        />

        <Input
          label="Categoria"
          name="category"
          value={form.category}
          onChange={(event) => updateField("category", event.target.value)}
          required
        />

        <Input
          label="Preço"
          name="price"
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(event) => updateField("price", Number(event.target.value))}
          required
        />

        <Input
          label="URL da imagem"
          name="imageUrl"
          type="url"
          value={form.imageUrl}
          onChange={(event) => updateField("imageUrl", event.target.value)}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Descrição"
            name="description"
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            required
          />
        </div>

        {errorMessage ? (
          <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral md:col-span-2">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2 md:col-span-2">
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Salvando..."
              : isEditing
                ? "Salvar alterações"
                : "Criar produto"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
