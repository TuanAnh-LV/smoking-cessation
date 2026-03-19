import React from "react";
import { Trash2, Clock } from "lucide-react";
import { message } from "antd";
import { ReminderService } from "../../services/reminder.service";
import "./ReminderList.scss";

const ReminderList = ({ reminders, onDelete }) => {
  if (!reminders?.length) return null;

  const handleDelete = async (id) => {
    try {
      await ReminderService.delete(id);
      message.success("Reminder deleted");
      onDelete?.();
    } catch (err) {
      message.error("Failed to delete reminder");
    }
  };

  return (
    <div className="reminder-list">
      <div className="reminder-list__header">
        <h3>
          <Clock size={18} />
          Your reminders
        </h3>
      </div>

      <ul className="reminder-list__items">
        {reminders.map((reminder) => (
          <li key={reminder._id} className="reminder-list__item">
            <div className="reminder-list__content">
              <p className="reminder-list__title">{reminder.title}</p>
              {reminder.content && (
                <p className="reminder-list__description">{reminder.content}</p>
              )}
              <p className="reminder-list__time">
                {new Date(reminder.remind_at).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
                {reminder.is_recurring ? ` • ${reminder.repeat_pattern}` : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(reminder._id)}
              className="reminder-list__delete"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReminderList;
