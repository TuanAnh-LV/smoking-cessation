import React, { useState } from "react";
import "./NotificationSettings.scss"; // Import the SCSS file
import { IoIosNotificationsOutline } from "react-icons/io";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    dailyReminderMorning: false,
    dailyReminderReasons: false,
    dailyReminderProgress: false,
    achievementsNewBadge: false,
    achievementsMoldSavesMoney: false,
    achievementsImproveHealth: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSettings((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  return (
    <div className="notification-settings-container">
      <div className="settings-header">
        {/* Replace with an actual bell icon */}
        <span className="bell-icon">
          <IoIosNotificationsOutline />
        </span>
        <h2>Set up notifications</h2>
      </div>
      <div className="settings-content">
        <div className="reminder-section">
          <h3>Daily reminder</h3>
          <label>
            <input
              type="checkbox"
              name="dailyReminderMorning"
              checked={settings.dailyReminderMorning}
              onChange={handleCheckboxChange}
            />
            Morning message of encouragement
          </label>
          <label>
            <input
              type="checkbox"
              name="dailyReminderReasons"
              checked={settings.dailyReminderReasons}
              onChange={handleCheckboxChange}
            />
            Reminder of reasons to quit smoking
          </label>
          <label>
            <input
              type="checkbox"
              name="dailyReminderProgress"
              checked={settings.dailyReminderProgress}
              onChange={handleCheckboxChange}
            />
            Update progress
          </label>
        </div>
        <div className="achievements-section">
          <h3>Achievements</h3>
          <label>
            <input
              type="checkbox"
              name="achievementsNewBadge"
              checked={settings.achievementsNewBadge}
              onChange={handleCheckboxChange}
            />
            New badge
          </label>
          <label>
            <input
              type="checkbox"
              name="achievementsMoldSavesMoney"
              checked={settings.achievementsMoldSavesMoney}
              onChange={handleCheckboxChange}
            />
            Mold saves money
          </label>
          <label>
            <input
              type="checkbox"
              name="achievementsImproveHealth"
              checked={settings.achievementsImproveHealth}
              onChange={handleCheckboxChange}
            />
            Improve health
          </label>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
