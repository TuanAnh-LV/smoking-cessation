import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="app-shell">
      <div className="app-shell__header">
        <Header />
      </div>
      <main className="app-main">
        <div className="app-main__content">
          <Outlet />
        </div>
      </main>
      <div className="app-shell__footer">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
  
