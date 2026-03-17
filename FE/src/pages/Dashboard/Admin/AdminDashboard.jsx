import { useEffect, useState } from "react";
import { AdminService } from "../../../services/admin.service";
import {
  Users,
  UserCheck,
  Award,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
} from "lucide-react";

const iconMap = {
  "Total Users": Users,
  "Active Memberships": CreditCard,
  "Active Coaches": UserCheck,
  "Badges Awarded": Award,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    AdminService.getDashboard()
      .then((res) => {
        const statsWithIcon = res.data.stats.map((s) => ({
          ...s,
          icon: iconMap[s.title] || Users,
          colorClass:
            s.title === "Total Users"
              ? "text-blue-600 bg-blue-100"
              : s.title === "Active Memberships"
              ? "text-green-600 bg-green-100"
              : s.title === "Active Coaches"
              ? "text-purple-600 bg-purple-100"
              : "text-orange-600 bg-orange-100",
        }));
        setStats(statsWithIcon);
        setActivities(res.data.recentActivities);
      })

      .catch((err) => {
        console.error("Failed to load dashboard:", err);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center border rounded px-3 py-1 text-sm hover:bg-gray-100">
            <Eye className="h-4 w-4 mr-2" /> View Reports
          </button>
          <button className="flex items-center border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm bg-white dark:bg-gray-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" /> Quick Action
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 bg-white rounded shadow">
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium">{stat.title}</span>
              <div className={`p-2 rounded ${stat.colorClass}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-sm mt-1">
              {stat.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              )}
              <span
                className={
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }
              >
                {stat.change}
              </span>
              <span className="ml-1 text-gray-400">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> */}
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-2xl font-semibold">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">System updates</p>
        {activities.length === 0 ? (
          <p className="text-gray-400 text-sm mt-4">
            No recent activities recorded.
          </p>
        ) : (
          <div className="space-y-4 mt-4">
            {activities.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center gap-3 p-3 rounded-lg hover:bg-muted/50"
              >
                <div className="flex gap-2">
                  <span
                    className={`w-2 h-2 rounded-full mt-2 ${
                      item.status === "success"
                        ? "bg-green-500"
                        : item.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {item.user && (
                        <span className="font-semibold text-blue-600">
                          {item.user}
                        </span>
                      )}
                      : {item.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(item.time).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    item.status === "success"
                      ? "bg-gray-900 text-white"
                      : item.status === "pending"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <p className="text-sm mb-4">Common administrative tasks</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="border rounded p-2 flex flex-col items-center hover:bg-gray-50">
              <UserCheck className="h-7 w-7 mb-1" />
              <span className="text-xs">Invite Coach</span>
            </button>
            <button className="border rounded p-2 flex flex-col items-center hover:bg-gray-50">
              <Award className="h-7 w-7 mb-1" />
              <span className="text-xs">Create Badge</span>
            </button>
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
}
