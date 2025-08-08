import { useState } from "react";
import { HomePage } from "./pages/Home";
import { GetStarted } from "./pages/GetStarted";
import { Dashboard } from "./pages/Dashboard";
import "./index.css";

type Page = "home" | "get-started" | "dashboard";

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  if (currentPage === "dashboard") {
    return (
      <Dashboard onLogout={() => navigateTo("home")} />
    );
  }

  if (currentPage === "get-started") {
    return (
      <GetStarted 
        onBack={() => navigateTo("home")}
        onSignUpSuccess={() => navigateTo("dashboard")}
      />
    );
  }

  return (
    <HomePage onGetStarted={() => navigateTo("get-started")} />
  );
}

export default App;
