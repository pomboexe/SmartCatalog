import { Input } from "../../components/ui/Input";

type ProductFiltersProps = {
  search: string;
  category: string;
  categories: string[];
  resultCount: number;
  categoryCount: number;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export function ProductFilters({
  search,
  category,
  categories,
  resultCount,
  categoryCount,
  onSearchChange,
  onCategoryChange,
}: ProductFiltersProps) {
  return (
    <>
      <div className="grid gap-4 rounded-2xl border border-ink/8 bg-surface-muted p-4 shadow-[0_16px_40px_-28px_var(--shadow-panel)] backdrop-blur-sm sm:grid-cols-[1.4fr_1fr] sm:p-5">
        <Input
          label="Buscar"
          name="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Nome ou descrição"
        />

        <label
          className="block text-sm font-medium text-ink-soft"
          htmlFor="category"
        >
          Categoria
          <select
            id="category"
            name="category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-ink/12 bg-mist px-3.5 py-3 text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
          >
            <option value="all">Todas</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink/8 bg-surface-muted px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-teal uppercase">
            Resultados
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {resultCount}
          </p>
        </div>
        <div className="rounded-2xl border border-ink/8 bg-surface-muted px-4 py-3">
          <p className="text-xs font-semibold tracking-wide text-teal uppercase">
            Categorias
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {categoryCount}
          </p>
        </div>
      </div>
    </>
  );
}
