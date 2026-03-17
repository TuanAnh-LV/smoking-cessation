// components/EditProfileModal.jsx
import React, { useState } from "react";
import { UserService } from "../../services/user.service";
import { message } from "antd";

const EditProfileModal = ({ user, onClose, onUpdated }) => {
  const [fullName, setFullName] = useState(user.full_name);
  const [birthDate, setBirthDate] = useState(user.birth_date?.split("T")[0]);
  const [gender, setGender] = useState(user.gender || "male");
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("full_name", fullName);
    formData.append("birth_date", birthDate);
    formData.append("gender", gender);
    if (avatar) formData.append("avatar", avatar);

    try {
      await UserService.updateUser(formData);
      message.success("Profile updated!");
      onUpdated();
      onClose();
    } catch (err) {
      message.error("Update failed!");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/30 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Birth Date</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
