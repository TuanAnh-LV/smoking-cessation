import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BadgeService } from "../../services/badge.service";
import { message } from "antd";

const defaultData = {
  name: "",
  type: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  proOnly: false,
  condition: {
    type: "",
    value: 0,
    unit: "",
    description: "",
  },
};

export default function BadgeFormPage() {
  const { id } = useParams(); // Nếu có id thì là edit
  const navigate = useNavigate();
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (id) {
      BadgeService.getBadgeById(id)
        .then((res) => {
          const badge = res?.data?.badge;
          if (badge) {
            setFormData({
              ...badge,
              date: badge.date?.substring(0, 10) || "",
            });
          }
        })
        .catch(() => message.error("Failed to load badge"));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("condition.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        condition: {
          ...prev.condition,
          [key]: type === "number" ? +value : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await BadgeService.updateBadge(id, formData);
        message.success("Badge updated!");
      } else {
        await BadgeService.createBadge(formData);
        message.success("Badge created!");
      }
      navigate("/admin/badges");
    } catch {
      message.error("Failed to save badge");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">
        {id ? "Edit Badge" : "Create Badge"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-medium">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-1"
            required
          />
        </div>

        <div>
          <label className="font-medium">Type</label>
          <input
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-1"
            required
          />
        </div>

        <div>
          <label className="font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-1"
            rows={2}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="proOnly"
            checked={formData.proOnly}
            onChange={handleChange}
          />
          <label className="font-medium">Pro Only</label>
        </div>

        <div>
          <label className="font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-1"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Condition Type</label>
            <select
              name="condition.type"
              value={formData.condition?.type || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              required
            >
              <option value="">-- Select type --</option>
              <option value="no_smoke_days">Smoke-Free Days</option>
              <option value="money_saved">Money Saved</option>
            </select>
          </div>

          <div>
            <label className="font-medium">Unit</label>
            <select
              name="condition.unit"
              value={formData.condition?.unit || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              required
            >
              <option value="">-- Select unit --</option>
              {formData.condition.type === "no_smoke_days" && (
                <option value="days">Days</option>
              )}
              {formData.condition.type === "money_saved" && (
                <option value="vnd">VND</option>
              )}
            </select>
          </div>
          <div className="col-span-2">
            <label className="font-medium">Condition Description</label>
            <input
              name="condition.description"
              value={formData.condition?.description || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-1"
              placeholder="e.g. 30 smoke-free days"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-black text-white rounded px-4 py-2 cursor-pointer"
        >
          {id ? "Update Badge" : "Create Badge"}
        </button>
      </form>
    </div>
  );
}
