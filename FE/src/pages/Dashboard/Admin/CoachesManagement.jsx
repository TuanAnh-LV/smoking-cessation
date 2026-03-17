import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react";
import { CoachService } from "../../../services/coach.service";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export default function CoachesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await CoachService.getAllCoaches();
        const data = res?.data || [];
        setCoaches(data);
      } catch (err) {
        console.error("Failed to fetch coaches:", err);
        setCoaches([]);
      }
    };

    fetchCoaches();
  }, []);

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    try {
      await CoachService.deleteCoach(selectedCoachId);
      setCoaches((prev) => prev.filter((c) => c._id !== selectedCoachId));
      message.success("Coach deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Delete failed");
    } finally {
      setShowDeleteConfirm(false);
      setSelectedCoachId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Coaches Management</h1>
          <p className="text-gray-500">Manage all registered coaches</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/admin/coaches/new")}
            className="flex items-center gap-1 bg-black text-white rounded h-[40px] px-3 py-1 cursor-pointer hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Coach
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-7">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              All Coaches
            </h2>
            <p className="text-sm text-gray-500">
              A list of all coaches in the system
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search coaches..."
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
              <th className="p-2 text-left">Coach</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Users</th>
              <th className="p-2 text-left">Specialization</th>
              <th className="p-2 text-left">Experience</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoaches.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
                  No coaches found.
                </td>
              </tr>
            ) : (
              filteredCoaches.map((coach) => (
                <tr key={coach._id} className="border-b border-b-gray-200">
                  <td className="p-5 flex items-center gap-2">
                    <img
                      src={coach.avatar || "/placeholder.svg"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{coach.full_name}</span>
                  </td>
                  <td className="p-2 text-gray-600">{coach.email}</td>
                  <td className="p-2 text-gray-700">
                    {coach.current_users} / {coach.max_users}
                  </td>
                  <td className="p-2 text-gray-600">{coach.specialization}</td>
                  <td className="p-2 text-gray-600">{coach.experience}</td>
                  <td className="p-2 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        className="px-1 hover:bg-gray-100"
                        onClick={() => navigate(`/admin/coaches/${coach._id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="px-1 text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedCoachId(coach._id);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showDeleteConfirm && (
          <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
              <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
              <p className="text-gray-600">
                Are you sure you want to delete this coach?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
