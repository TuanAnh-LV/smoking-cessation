import React, { useState } from "react";
import { ReminderService } from "../../services/reminder.service";
import { message } from "antd";
import { Plus, Edit, Trash2, Clock } from "lucide-react";

const CreateReminderForm = ({ planId, onCreated }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    remind_at: "",
    is_recurring: false,
    repeat_pattern: "",
  });

  const toggleForm = () => setFormVisible((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const localTime = new Date(form.remind_at);
    if (isNaN(localTime.getTime())) {
      message.error("Remind time is not valid");
      return;
    }

    // Convert local → UTC
    const utcTime = new Date(
      localTime.getTime() - localTime.getTimezoneOffset() * 60000
    );
    const utcISOString = new Date(form.remind_at).toISOString();

    const nowUTC = new Date();
    if (utcTime <= nowUTC) {
      message.error("Please choose a time in the future");
      return;
    }

    if (form.is_recurring && !form.repeat_pattern) {
      message.error("Please select a repeat pattern");
      return;
    }

    try {
      await ReminderService.create({
        ...form,
        plan_id: planId,
        remind_at: utcISOString,
        repeat_pattern: form.is_recurring ? form.repeat_pattern : null,
      });

      message.success("Reminder created!");
      setForm({
        title: "",
        content: "",
        remind_at: "",
        is_recurring: false,
        repeat_pattern: "",
      });
      onCreated?.();
      setFormVisible(false);
    } catch (err) {
      message.error(
        err?.response?.data?.message || "Failed to create reminder"
      );
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={toggleForm}
        className="mb-3 px-4 py-2 flex items-center gap-1 bg-black text-white rounded h-[40px] px-3 py-1 cursor-pointer hover:bg-gray-800 transition-all"
      >
        {formVisible ? <Edit size={18} /> : <Plus size={18} />}
        {formVisible ? "Cancel Reminder" : "Create Reminder"}
      </button>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-5 space-y-4 border"
        >
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Edit size={20} /> New Reminder
          </h2>

          {/* --- Title --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder="e.g., Drink water"
            />
          </div>

          {/* --- Content --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Optional description"
            />
          </div>

          {/* --- Time --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remind at
            </label>
            <input
              type="datetime-local"
              name="remind_at"
              value={form.remind_at}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* --- Repeat toggle --- */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_recurring"
              name="is_recurring"
              checked={form.is_recurring}
              onChange={handleChange}
            />
            <label htmlFor="is_recurring" className="text-sm text-gray-700">
              Repeat
            </label>
          </div>

          {/* --- Repeat pattern --- */}
          {form.is_recurring && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Repeat pattern
              </label>
              <select
                name="repeat_pattern"
                value={form.repeat_pattern}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Select...</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
          >
            Save Reminder
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateReminderForm;
