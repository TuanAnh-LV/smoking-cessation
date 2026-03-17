import React, { useEffect, useState } from "react";
import TransactionHistory from "../../components/TransactionHistory/TransactionHistory";
import { UserService } from "../../services/user.service";
import { useAuth } from "../../context/authContext";
import EditProfileModal from "./EditProfileModal";
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userInfo } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  useEffect(() => {
    UserService.getCurrentUser()
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Lỗi lấy user:", err));
  }, [userInfo]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="bg-white shadow-lg  p-6 mb-8 text-center">
        <img
          src={user.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-32 h-32 mx-auto rounded-full border-4 border-gray-200 object-cover mb-4"
        />
        <h2 className="text-2xl font-bold mb-4">{user.full_name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800 break-words">
              {user.email}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Birth date</p>
            <p className="font-medium text-gray-800">
              {new Date(user.birth_date).toLocaleDateString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium text-gray-800">{user.gender}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Joined</p>
            <p className="font-medium text-gray-800">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          className="mt-6 px-6 py-2 bg-black text-white rounded h-[40px] cursor-pointer hover:bg-gray-800 transition"
          onClick={() => setShowEdit(true)}
        >
          Edit Profile
        </button>

        {showEdit && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEdit(false)}
            onUpdated={() => {
              UserService.getCurrentUser().then((res) => setUser(res.data));
            }}
          />
        )}
      </div>

      <TransactionHistory />
    </div>
  );
};

export default ProfilePage;
