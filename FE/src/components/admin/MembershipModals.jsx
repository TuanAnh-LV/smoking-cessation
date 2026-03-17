// MembershipModals.js
import { useState, useEffect } from "react";
import { message } from "antd";
export function EditMembershipModal({ open, onClose, membership, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration_days: 0,
    price: 0,
    can_message_coach: false,
    can_assign_coach: false,
    can_use_quitplan: false,
    can_use_reminder: false,
    can_earn_special_badges: false,
  });

  useEffect(() => {
    if (membership) setFormData({ ...membership });
  }, [membership]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      message.warning("Please select a plan name.");
      return;
    }
    onSave({ ...formData });
    message.success("Membership updated successfully!");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[500px] space-y-4">
        <h2 className="text-xl font-semibold">Edit Membership</h2>
        <label className="text-sm font-medium">Plan Name</label>
        <select
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Plan Name --</option>
          <option value="default">Default</option>
          <option value="pro">Pro</option>
        </select>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
        />
        <label className="text-sm font-medium">Duration Days</label>
        <input
          name="duration_days"
          type="number"
          value={formData.duration_days}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <label className="text-sm font-medium">Price</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <label className="text-sm font-medium">Permissions</label>
        <div className="grid grid-cols-2 gap-2 border p-3 rounded-md bg-gray-50">
          <label>
            <input
              type="checkbox"
              name="can_message_coach"
              checked={formData.can_message_coach}
              onChange={handleChange}
            />{" "}
            Message Coach
          </label>
          <label>
            <input
              type="checkbox"
              name="can_assign_coach"
              checked={formData.can_assign_coach}
              onChange={handleChange}
            />{" "}
            Assign Coach
          </label>
          <label>
            <input
              type="checkbox"
              name="can_use_quitplan"
              checked={formData.can_use_quitplan}
              onChange={handleChange}
            />{" "}
            Use Quit Plan
          </label>
          <label>
            <input
              type="checkbox"
              name="can_use_reminder"
              checked={formData.can_use_reminder}
              onChange={handleChange}
            />{" "}
            Use Reminder
          </label>
          <label>
            <input
              type="checkbox"
              name="can_earn_special_badges"
              checked={formData.can_earn_special_badges}
              onChange={handleChange}
            />{" "}
            Earn Special Badges
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-blue-600 text-white rounded"
            type="submit"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export function DeleteConfirmationModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-[400px]">
        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
        <p>Are you sure you want to delete this membership?</p>
        <div className="flex justify-end mt-6 gap-3">
          <button onClick={onClose} className="border px-4 py-1 rounded">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              message.success("Membership deleted successfully!");
              onClose();
            }}
            className="bg-red-600 text-white px-4 py-1 rounded"
          >
            Delete
          </button>
        </div>
        <messageContainer position="top-center" autoClose={2000} />
      </div>
    </div>
  );
}

export function CreateMembershipModal({ open, onClose, onCreate }) {
  const initialState = {
    name: "",
    description: "",
    duration_days: 0,
    price: 0,
    can_message_coach: false,
    can_assign_coach: false,
    can_use_quitplan: false,
    can_use_reminder: false,
    can_earn_special_badges: false,
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      message.warning("Please select a plan name.");
      return;
    }
    onCreate({ ...formData });
    setFormData(initialState);
    message.success("Membership created successfully!");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[500px] space-y-4">
        <h2 className="text-xl font-semibold">Create Membership</h2>
        <label className="text-sm font-medium">Plan Name</label>
        <select
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">-- Select Plan Name --</option>
          <option value="default">Default – Cơ bản</option>
          <option value="pro">Pro – Nâng cao</option>
        </select>
        <label className="text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
        />
        <label className="text-sm font-medium">Duration Days</label>
        <input
          name="duration_days"
          type="number"
          value={formData.duration_days}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <label className="text-sm font-medium">Price</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
        <label className="text-sm font-medium">Permissions</label>
        <div className="grid grid-cols-2 gap-2 border p-3 rounded-md bg-gray-50">
          <label>
            <input
              type="checkbox"
              name="can_message_coach"
              checked={formData.can_message_coach}
              onChange={handleChange}
            />{" "}
            Message Coach
          </label>
          <label>
            <input
              type="checkbox"
              name="can_assign_coach"
              checked={formData.can_assign_coach}
              onChange={handleChange}
            />{" "}
            Assign Coach
          </label>
          <label>
            <input
              type="checkbox"
              name="can_use_quitplan"
              checked={formData.can_use_quitplan}
              onChange={handleChange}
            />{" "}
            Use Quit Plan
          </label>
          <label>
            <input
              type="checkbox"
              name="can_use_reminder"
              checked={formData.can_use_reminder}
              onChange={handleChange}
            />{" "}
            Use Reminder
          </label>
          <label>
            <input
              type="checkbox"
              name="can_earn_special_badges"
              checked={formData.can_earn_special_badges}
              onChange={handleChange}
            />{" "}
            Earn Special Badges
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1 bg-green-600 text-white rounded"
            type="submit"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
