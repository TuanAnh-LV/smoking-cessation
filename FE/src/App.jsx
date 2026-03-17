import { Suspense } from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useLocation,
} from "react-router-dom";
import routes from "./routes/routes";
import PlanChecker from "./app/PlanChecker";
import { useAuth } from "./context/authContext";
import ChatWidget from "./components/ChatWidget";

function AppRoutes() {
  const routing = useRoutes(routes);
  return routing;
}

function MainApp() {
  const { token, userInfo } = useAuth();
  const location = useLocation();

  const hideWidgetRoutes = ["/login", "/register"];
  const shouldHideWidget = hideWidgetRoutes.includes(location.pathname);

  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      {token && userInfo && <PlanChecker key={token} />}
      <AppRoutes />
      {!shouldHideWidget && <ChatWidget />}
    </Suspense>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
