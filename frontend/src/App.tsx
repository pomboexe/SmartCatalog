import { BrowserRouter } from "react-router-dom";
import { QueryProvider } from "./app/QueryProvider";
import { AppRouter } from "./app/router";
import { AuthProvider } from "./features/auth/AuthContext";
import { ThemeProvider } from "./features/theme/ThemeContext";

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryProvider>
  );
}
