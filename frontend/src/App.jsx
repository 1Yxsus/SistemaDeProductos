import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import "./App.css";

function App() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  if (pathname === "/login") {
    return <LoginPage />;
  }

  if (pathname === "/dashboard") {
    return <DashboardPage />;
  }

  return <LandingPage />;
}

export default App;
