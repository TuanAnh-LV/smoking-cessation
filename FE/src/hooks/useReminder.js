import { useEffect, useState } from "react";
import { ReminderService } from "../services/reminder.service";

export const useReminder = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      const res = await ReminderService.getMyReminders();
      setReminders(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi fetch reminders:", error);
    } finally {
      setLoading(false);
    }
  };

  const addReminder = (newReminder) => {
    setReminders((prev) => [newReminder, ...prev]);
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r._id !== id));
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return {
    reminders,
    loading,
    fetchReminders,
    addReminder,
    deleteReminder,
  };
};
