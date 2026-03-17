import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react";
import { QuitPlanService } from "../../../services/quitPlan.service";
export default function QuitPlansManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [quitPlans, setQuitPlans] = useState([]);

  useEffect(() => {
    QuitPlanService.getAllQuitPlans()
      .then((response) => {
        setQuitPlans(response?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching quit plans:", error);
      });
  }, []);

  const filteredPlans = quitPlans.filter((plan) => {
    const userName = plan.user_id?.full_name || "";
    const coachName = plan.coach_user_id?.full_name || "";
    return (
      plan.goal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coachName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.note?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quit Plans Management</h1>
          <p className="text-gray-500">
            Manage smoking cessation programs and plans
          </p>
        </div>
        <button className="flex items-center gap-1 bg-black text-white rounded h-[40px] px-3 py-1 cursor-pointer hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-1" /> Create Plan
        </button>
      </div>

      <div className="bg-white rounded shadow p-7">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              All Quit Plans
            </h2>
            <p className="text-sm text-gray-500">
              A list of all smoking cessation plans
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded pl-10 h-[40px] w-[300px] pr-2 py-1 text-sm"
              />
            </div>
            <button className="flex items-center border rounded px-2 py-1 text-sm hover:bg-gray-100 h-[40px]">
              <Filter className="h-4 w-4 mr-1" /> Filter
            </button>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead className="border-b border-b-gray-200">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Coach</th>
              <th className="p-2 text-left">Goal</th>
              <th className="p-2 text-left">Start Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Note</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlans.map((plan) => (
              <tr key={plan._id} className="border-b border-b-gray-200">
                <td className="p-2">{plan.user_id?.full_name || "-"}</td>
                <td className="p-2">{plan.coach_user_id?.full_name || "-"}</td>
                <td className="p-2">{plan.goal}</td>
                <td className="p-2">
                  {new Date(plan.start_date).toLocaleDateString()}
                </td>
                <td className="p-2 capitalize">
                  <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">
                    {plan.status}
                  </span>
                </td>
                <td className="p-2 text-gray-500 truncate max-w-xs">
                  {plan.note || "-"}
                </td>
                <td className="p-2 text-center">
                  <div className="inline-flex gap-1">
                    <button className="px-1 hover:bg-gray-100">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="px-1 hover:bg-gray-100">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="px-1 text-red-600 hover:bg-gray-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredPlans.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-400">
                  No quit plans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
