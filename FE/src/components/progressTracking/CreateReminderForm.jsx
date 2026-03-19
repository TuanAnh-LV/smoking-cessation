import React, { useState } from "react";
import { message } from "antd";
import { Plus, Edit } from "lucide-react";
import { ReminderService } from "../../services/reminder.service";
import "./CreateReminderForm.scss";

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
    if (Number.isNaN(localTime.getTime())) {
      message.error("Remind time is not valid");
      return;
    }

    const utcTime = new Date(
      localTime.getTime() - localTime.getTimezoneOffset() * 60000
    );
    const utcISOString = new Date(form.remind_at).toISOString();

    if (utcTime <= new Date()) {
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

      message.success("Reminder created");
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
        err?.error?.response?.data?.message ||
          err?.error?.response?.data?.error ||
          err?.message ||
          "Failed to create reminder"
      );
    }
  };

  return (
    <div className="reminder-form">
      <button type="button" onClick={toggleForm} className="reminder-form__toggle">
        {formVisible ? <Edit size={18} /> : <Plus size={18} />}
        {formVisible ? "Close reminder form" : "Create reminder"}
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="reminder-form__panel">
          <div className="reminder-form__panel-header">
            <h3>New reminder</h3>
            <p>Schedule a prompt to keep the plan visible during the day.</p>
          </div>

          <div className="reminder-form__field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Drink water"
            />
          </div>

          <div className="reminder-form__field">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={3}
              placeholder="Optional description"
            />
          </div>

          <div className="reminder-form__grid">
            <div className="reminder-form__field">
              <label htmlFor="remind_at">Remind at</label>
              <input
                id="remind_at"
                type="datetime-local"
                name="remind_at"
                value={form.remind_at}
                onChange={handleChange}
                required
              />
            </div>

            <div className="reminder-form__field reminder-form__field--toggle">
              <label htmlFor="is_recurring">Repeat</label>
              <label className="reminder-form__checkbox">
                <input
                  type="checkbox"
                  id="is_recurring"
                  name="is_recurring"
                  checked={form.is_recurring}
                  onChange={handleChange}
                />
                <span>Recurring reminder</span>
              </label>
            </div>
          </div>

          {form.is_recurring && (
            <div className="reminder-form__field">
              <label htmlFor="repeat_pattern">Repeat pattern</label>
              <select
                id="repeat_pattern"
                name="repeat_pattern"
                value={form.repeat_pattern}
                onChange={handleChange}
                required
              >
                <option value="">Select pattern</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          <button type="submit" className="reminder-form__submit">
            Save reminder
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateReminderForm;
