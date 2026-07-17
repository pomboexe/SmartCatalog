import { useAuth } from "../features/auth/AuthContext";

export function DashboardPage() {
  const { isAdmin } = useAuth();

  return (
    <section className="page">
      <h1>Produtos</h1>
      <p>
        Listagem do catálogo da sua empresa.
        {isAdmin
          ? " Como admin, você poderá criar, editar e excluir."
          : " Como user, você só visualiza."}
      </p>

      <div className="placeholder-card">
        <strong>Próximo passo</strong>
        <p>
          Conectar `listProducts`, `createProduct`, `updateProduct` e
          `deleteProduct` do `productService`.
        </p>
        <ul>
          <li>Carregar produtos com o token do `useAuth()`</li>
          <li>Mostrar tabela/cards</li>
          <li>Exibir formulário de CRUD apenas se `isAdmin`</li>
        </ul>
      </div>
    </section>
  );
}
