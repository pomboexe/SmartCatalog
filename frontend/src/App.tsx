import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./app/QueryProvider";
import { AppRouter } from "./app/router";
import { AuthProvider } from "./features/auth/AuthContext";

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  );
}
