import React, { useEffect, useState } from "react";
import { CoachUserService } from "../../../services/coachuser.service";
import { Search, Edit, Trash2, Eye, Filter } from "lucide-react";
import { useAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
const CoachUser = () => {
  const { userInfo } = useAuth();
  const [relations, setRelations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo?._id) return;

    CoachUserService.getRelations({ coach_id: userInfo._id })
      .then((res) => {
        setRelations(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch coach-user relations:", err);
      });
  }, [userInfo]);

  const filtered = relations.filter((relation) => {
    const user = relation?.user_id;
    return (
      user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Clients</h1>
          <p className="text-gray-500 mt-1">
            All users assigned to you as a coach
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-7">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              Assigned Users
            </h2>
            <p className="text-sm text-gray-500">
              Users under your coaching care
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded pl-10 h-[40px] w-[300px] pr-2 py-1 text-sm"
              />
            </div>
            <button className="flex items-center border rounded px-2 py-1 text-sm hover:bg-gray-100 h-[40px]">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </button>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead className="border-b border-b-gray-200">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Quit Plan(Goals)</th>
              <th className="p-2 text-left">Joined</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((rel) => (
              <tr key={rel._id} className="border-b border-b-gray-200 p-7">
                <td className="p-5 font-medium">
                  {rel.user_id?.full_name || "Unknown"}
                </td>
                <td className="p-2 text-gray-500">{rel.user_id?.email}</td>
                <td className="p-2 text-gray-500">
                  {rel.quitPlans?.length > 0 ? (
                    <div className="space-y-1">
                      {rel.quitPlans.map((plan, idx) => (
                        <div key={idx} className="text-sm">
                          {plan.goal || "No goal title"}
                          {plan.status ? ` (${plan.status})` : ""}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="italic text-gray-400">No plans</span>
                  )}
                </td>

                <td className="p-2 text-gray-500">
                  {new Date(rel.user_id?.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 text-right">
                  <div className="inline-flex gap-1">
                    <button
                      onClick={() => navigate(`/coach/user/${rel._id}`)}
                      className="rounded px-1 py-0.5 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="rounded px-1 py-0.5 hover:bg-gray-100">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="rounded px-1 py-0.5 text-red-600 hover:bg-gray-100">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoachUser;
