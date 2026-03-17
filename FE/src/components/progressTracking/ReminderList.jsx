import React from "react";
import { Trash2, Clock } from "lucide-react";
import { ReminderService } from "../../services/reminder.service";
import { message } from "antd";

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
    <div className="bg-white rounded-xl shadow-md p-5 mb-5">
      <h3 className="text-md font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Clock size={18} /> Your Reminders
      </h3>

      <ul className="space-y-4">
        {reminders.map((r) => (
          <li
            key={r._id}
            className="border border-gray-200 rounded-lg px-4 py-3 flex justify-between items-center hover:bg-gray-50"
          >
            <div>
              <p className="font-medium text-gray-800">{r.title}</p>
              {r.content && (
                <p className="text-sm text-gray-600">{r.content}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                🕒{" "}
                {new Date(r.remind_at).toLocaleString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}{" "}
                {r.is_recurring ? `• ${r.repeat_pattern}` : ""}
              </p>
            </div>
            <button
              onClick={() => handleDelete(r._id)}
              className="text-red-500 hover:text-red-700 p-1"
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
