import { Suspense, useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  useRoutes,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import routes from "./routes/routes";
import PlanChecker from "./app/PlanChecker";
import { useAuth } from "./context/authContext";
import ChatWidget from "./components/ChatWidget";
import Loading from "./app/Loading";

function AppRoutes() {
  const routing = useRoutes(routes);
  return routing;
}

function MainApp() {
  const { token, userInfo } = useAuth();
  const location = useLocation();
  const pendingRequestCount = useSelector((state) => state.loading.pendingCount);
  const [showGlobalLoading, setShowGlobalLoading] = useState(false);
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const hideWidgetRoutes = ["/login", "/register"];
  const shouldHideWidget = hideWidgetRoutes.includes(location.pathname);

  useEffect(() => {
    if (pendingRequestCount > 0) {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      if (!showGlobalLoading && !showTimerRef.current) {
        showTimerRef.current = setTimeout(() => {
          setShowGlobalLoading(true);
          showTimerRef.current = null;
        }, 180);
      }
      return;
    }

    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }

    if (showGlobalLoading && !hideTimerRef.current) {
      hideTimerRef.current = setTimeout(() => {
        setShowGlobalLoading(false);
        hideTimerRef.current = null;
      }, 220);
    } else if (!showGlobalLoading) {
      setShowGlobalLoading(false);
    }
  }, [pendingRequestCount, showGlobalLoading]);

  useEffect(() => {
    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <Suspense
      fallback={
        <Loading
          title="Opening your support space"
          description="A few helpful tools are being prepared for your smoke-free journey."
        />
      }
    >
      {token && userInfo && <PlanChecker key={token} />}
      <AppRoutes />
      {!shouldHideWidget && <ChatWidget />}
      {showGlobalLoading && (
        <Loading
          title="Working on your request"
          description="We are updating your plan and syncing the latest information."
        />
      )}
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
