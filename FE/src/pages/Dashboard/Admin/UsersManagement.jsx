import { useEffect, useState } from "react";
import { UserService } from "../../../services/user.service";
import { UserMembershipService } from "../../../services/userMembership.service";
import { Search, Edit, Trash2, Eye, Filter } from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    UserService.getAllUsers()
      .then(async (res) => {
        const users = res.data;

        const usersWithMembership = await Promise.all(
          users.map(async (user) => {
            try {
              const memRes = await UserMembershipService.getByUserId(user._id);
              return {
                ...user,
                membership: memRes?.data?.package_id?.type || "None",
              };
            } catch (err) {
              return { ...user, membership: "None" };
            }
          })
        );

        setUsers(usersWithMembership);
      })
      .catch((err) => {
        console.error("Failed to fetch users:", err);
      });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-gray-500 mt-1">
            Manage user accounts and their information
          </p>
        </div>
      </div>

      <div className="bg-white rounded shadow p-7">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold leading-none tracking-tight">
              All Users
            </h2>
            <p className="text-sm text-gray-500">
              A list of all users in your system
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
              <th className="p-2 text-left">Membership</th>
              <th className="p-2 text-left">Join Date</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-b-gray-200 p-7">
                <td className="p-5 flex items-center gap-2">
                  <span className="font-medium">{user.full_name}</span>
                </td>
                <td className="p-2 text-gray-500">{user.email}</td>
                <td className="p-2">
                  <span className="border rounded-3xl px-2 py-0.5 text-xs">
                    {user.membership || "-"}
                  </span>
                </td>
                <td className="p-2 text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 text-right">
                  <div className="inline-flex gap-1">
                    <button className="rounded px-1 py-0.5 hover:bg-gray-100">
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
}
