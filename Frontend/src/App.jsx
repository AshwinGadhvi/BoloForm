import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <AuthProvider>
  <ThemeProvider>
    <Toaster position="top-center" />
    <AppRoutes />
  </ThemeProvider>
</AuthProvider>
  );
}

export default App;
