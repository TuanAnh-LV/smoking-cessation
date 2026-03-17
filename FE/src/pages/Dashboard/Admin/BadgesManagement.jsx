import React, { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react";
import { BadgeService } from "../../../services/badge.service";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function BadgesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [badges, setBadges] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await BadgeService.getAllBadges();
        const badgeArray = Array.isArray(res?.data?.badges)
          ? res.data.badges
          : [];
        setBadges(badgeArray);
      } catch (err) {
        console.error("Failed to fetch badges", err);
        message.error("Failed to load badges");
      }
    };

    fetchBadges();
  }, []);

  const handleDelete = async () => {
    try {
      await BadgeService.deleteBadge(selectedBadgeId);
      setBadges((prev) =>
        prev.filter((badge) => badge._id !== selectedBadgeId)
      );
      message.success("Badge deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Delete failed");
    } finally {
      setShowDeleteConfirm(false);
      setSelectedBadgeId(null);
    }
  };

  const filteredBadges = badges.filter(
    (badge) =>
      badge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      badge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Badges Management</h1>
          <p className="text-gray-500">Manage achievement badges and rewards</p>
        </div>
        <button
          onClick={() => navigate("/admin/badges/create")}
          className="flex items-center gap-1 bg-black text-white rounded h-[40px] px-3 py-1 cursor-pointer hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" /> Create Badge
        </button>
      </div>

      <div className="bg-white rounded shadow p-7">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              All Badges
            </h2>
            <p className="text-gray-500">
              A list of all achievement badges in your system
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search badges..."
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
              <th className="p-4 text-left">Badge</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Criteria</th>
              <th className="p-4 text-left">Pro Only</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBadges.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No badges found.
                </td>
              </tr>
            ) : (
              filteredBadges.map((badge) => (
                <tr
                  key={badge._id || badge.id}
                  className="border-b border-b-gray-200"
                >
                  <td className="p-4 font-medium">{badge.name}</td>
                  <td className="p-4 text-gray-500">{badge.description}</td>
                  <td className="p-4 text-sm">
                    {badge.condition?.description || ""}
                  </td>
                  <td className="p-4 text-xs">
                    {badge.proOnly ? "Yes" : "No"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        className="px-3 hover:bg-gray-100"
                        onClick={() => navigate(`/admin/badges/${badge._id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="px-3 text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          setSelectedBadgeId(badge._id);
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

        {/* Modal confirm delete */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
              <h2 className="text-lg font-semibold mb-2">Confirm Deletion</h2>
              <p className="text-gray-600">
                Are you sure you want to delete this badge?
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
