import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  CreditCard,
} from "lucide-react";
import { MembershipService } from "../../../services/membership.service";
import { UserMembershipService } from "../../../services/userMembership.service";
import {
  EditMembershipModal,
  DeleteConfirmationModal,
  CreateMembershipModal,
} from "../../../components/admin/MembershipModals";

export default function MembershipsManagement() {
  const [memberships, setMemberships] = useState([]);
  const [membershipStats, setMembershipStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMembership, setEditingMembership] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const refreshData = async () => {
    try {
      const [membershipRes, userMembershipRes] = await Promise.all([
        MembershipService.getAllMemberships(),
        UserMembershipService.getAllUserMemberships(),
      ]);

      const allMemberships = membershipRes.data || [];
      const allUserMemberships = userMembershipRes.data || [];

      const countMap = {};
      for (const m of allUserMemberships) {
        if (m.status !== "active") continue;
        const name = m.package_id?.name || "Unknown"; // CHỈNH Ở ĐÂY
        countMap[name] = (countMap[name] || 0) + 1;
      }

      setMemberships(allMemberships);
      setMembershipStats(countMap);
    } catch (err) {
      console.error("Failed to fetch data", err);
      setError("Failed to load membership data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const filteredMemberships = memberships.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Memberships Management
          </h1>
          <p className="text-gray-500 mt-2">
            Manage subscription plans and pricing
          </p>
        </div>
        <button
          className="flex items-center gap-1 bg-black text-white rounded h-[40px] px-3 py-1 cursor-pointer hover:bg-gray-800"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Create Plan
        </button>
      </div>

      <div className="bg-white rounded shadow p-7">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              All Membership Plans
            </h2>
            <p className="text-sm text-gray-500">
              A list of all subscription plans in your system
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

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="border-b border-b-gray-200">
              <tr>
                <th className="p-2 text-left">Plan Name</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Duration</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Users</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMemberships.map((m) => (
                <tr key={m._id} className="border-b border-b-gray-200">
                  <td className="p-5 flex gap-2 items-center">
                    <CreditCard className="h-4 w-4 text-gray-400" />
                    {m.name}
                  </td>
                  <td className="p-2 font-mono">${m.price}</td>
                  <td className="p-2">
                    <span className="px-2 py-0.5 text-xs">
                      {m.duration_days || 0}
                    </span>
                  </td>
                  <td className="p-2 text-gray-500 truncate max-w-[200px]">
                    {m.description}
                  </td>
                  <td className="p-2">{membershipStats[m.name] || 0} users</td>
                  <td className="p-2 text-right">
                    <div className="inline-flex gap-1">
                      <button className="rounded px-1 hover:bg-gray-100">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditingMembership(m)}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeletingId(m._id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <EditMembershipModal
        open={!!editingMembership}
        membership={editingMembership}
        onClose={() => setEditingMembership(null)}
        onSave={async (updatedData) => {
          await MembershipService.updateMembership(
            editingMembership._id,
            updatedData
          );
          setEditingMembership(null);
          refreshData();
        }}
      />

      <DeleteConfirmationModal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={async () => {
          await MembershipService.deleteMembership(deletingId);
          setDeletingId(null);
          refreshData();
        }}
      />

      <CreateMembershipModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={async (data) => {
          await MembershipService.createMembership(data);
          setCreateModalOpen(false);
          refreshData();
        }}
      />
    </div>
  );
}
