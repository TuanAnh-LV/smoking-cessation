import { DashboardSidebar } from "../components/sidebar/DashboardSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ role = "admin" }) => {
  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      <DashboardSidebar
        role={role}
        userName="Admin User"
        userEmail="admin@system.com"
      />
      <main className="flex-1 p-6 overflow-auto">
        {/* <div className="max-w-7xl mx-auto w-full"> */}
        <Outlet />
        {/* </div> */}
      </main>
    </div>
  );
};

export default DashboardLayout;
