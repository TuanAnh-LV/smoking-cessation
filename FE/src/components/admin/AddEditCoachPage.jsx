import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CoachService } from "../../services/coach.service";
import { message } from "antd";

export default function AddEditCoachPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
    birth_date: "",
    gender: "",
    avatar: "",
  });

  useEffect(() => {
    if (isEdit) {
      CoachService.getCoachById(id)
        .then((res) => {
          const data = res.data;
          setFormData({
            full_name: data.full_name || "",
            email: data.email || "",
            password: "",
            specialization: data.specialization || "",
            experience: data.experience || "",
            birth_date: data.birth_date?.substring(0, 10) || "",
            gender: data.gender || "",
            avatar: data.avatar || "",
          });
        })
        .catch(() => {
          message.error("Failed to load coach data");
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("full_name", formData.full_name);
      form.append("email", formData.email);
      if (!isEdit) form.append("password", formData.password);
      form.append("specialization", formData.specialization);
      form.append("experience", formData.experience);
      form.append("birth_date", formData.birth_date);
      form.append("gender", formData.gender);
      if (avatarFile) form.append("avatar", avatarFile);

      if (isEdit) {
        await CoachService.updateCoach(id, form);
        message.success("Coach updated successfully");
      } else {
        await CoachService.createCoach(form);
        message.success("Coach created successfully");
      }
      navigate("/admin/coaches");
    } catch (err) {
      console.error("Save failed", err);
      message.error("Failed to save coach");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Coach" : "Add New Coach"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
          required
          disabled={isEdit}
        />
        {!isEdit && (
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border p-2 rounded"
            required
          />
        )}
        <input
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="Experience"
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {formData.avatar && !avatarFile && (
          <img
            src={formData.avatar}
            alt="avatar"
            className="h-16 w-16 object-cover rounded-full"
          />
        )}
        {avatarFile && (
          <img
            src={URL.createObjectURL(avatarFile)}
            alt="preview"
            className="h-16 w-16 object-cover rounded-full"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatarFile(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          {isEdit ? "Update Coach" : "Create Coach"}
        </button>
      </form>
    </div>
  );
}
