import { useState } from "react";
import { HomePage } from "./pages/Home";
import { GetStarted } from "./pages/GetStarted";
import { Dashboard } from "./pages/Dashboard";
import { ThemeProvider } from "./hooks/useTheme";
import "./index.css";

type Page = "home" | "get-started" | "dashboard";

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <ThemeProvider>
      {currentPage === "dashboard" && (
        <Dashboard onLogout={() => navigateTo("home")} />
      )}
      
      {currentPage === "get-started" && (
        <GetStarted 
          onBack={() => navigateTo("home")}
          onSignUpSuccess={() => navigateTo("dashboard")}
        />
      )}
      
      {currentPage === "home" && (
        <HomePage onGetStarted={() => navigateTo("get-started")} />
      )}
    </ThemeProvider>
  );
}

export default App;
