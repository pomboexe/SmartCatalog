import { Button } from "../../components/ui/Button";
import type { Product } from "../../types";

type ProductCardProps = {
  product: Product;
  isAdmin: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  isDeleting?: boolean;
};

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function ProductCard({
  product,
  isAdmin,
  onEdit,
  onDelete,
  isDeleting = false,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-ink/8 bg-surface-muted shadow-[0_16px_40px_-28px_var(--shadow-panel)] backdrop-blur-sm">
      <div className="aspect-[4/3] overflow-hidden bg-mist">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-teal uppercase">
            {product.category}
          </p>
          <h3 className="font-display text-lg font-bold tracking-tight text-ink">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-ink-soft/75">
            {product.description}
          </p>
        </div>

        <p className="font-display text-xl font-bold text-ink">
          {formatPrice(product.price)}
        </p>

        {isAdmin ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 py-2.5"
              onClick={() => onEdit(product)}
            >
              Editar
            </Button>
            <Button
              type="button"
              variant="danger"
              className="flex-1 py-2.5"
              onClick={() => onDelete(product)}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-ink/8 bg-mist/70 px-3 py-2.5">
            <p className="text-sm font-semibold text-ink">Disponível no catálogo</p>
            <p className="mt-0.5 text-xs text-ink-soft/75">
              Pergunte no chat para recomendações
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
