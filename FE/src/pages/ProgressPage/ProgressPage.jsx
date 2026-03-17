// ProgressPage.jsx
import React, { useEffect, useState } from "react";
import StatCards from "../../components/StartCards/StatCards";
import QuitPlanStages from "../../components/progressTracking/QuitPlanStages";
import { QuitPlanService } from "../../services/quitPlan.service";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import styles from "./ProgressPage.module.css";
import { useParams } from "react-router-dom";
import CreateReminderForm from "../../components/progressTracking/CreateReminderForm";
import ReminderList from "../../components/progressTracking/ReminderList";
import { ReminderService } from "../../services/reminder.service";
import { message } from "antd";
import { UserService } from "../../services/user.service";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const ProgressPage = () => {
  const [summary, setSummary] = useState(null);
  const { id: planId } = useParams();
  const [reminders, setReminders] = useState([]);
  const [membershipPackageCode, setMembershipPackageCode] = useState("");
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const checkPermission = async () => {
    try {
      const res = await UserService.getUserMembership(userInfo._id);
      const code = res?.data?.package_id?.type;
      setMembershipPackageCode(code);
    } catch (err) {
      console.error("Không thể kiểm tra quyền:", err);
    }
  };
  useEffect(() => {
    if (userInfo?._id) {
      checkPermission();
    }
  }, [userInfo?._id]);

  const fetchSummary = async () => {
    try {
      const res = await QuitPlanService.getPlanSummary(planId);
      setSummary(res.data);
    } catch (err) {
      console.error("Error loading summary data", err);
    }
  };
  const fetchReminders = async () => {
    try {
      const res = await ReminderService.getMyReminders();
      if (res?.data?.status === "cancelled") {
        message.info("Your quit plan has been cancelled.");
        localStorage.removeItem("currentPlanId");
        navigate("/status");
        return;
      }
      setReminders(res.data || []);
    } catch (err) {
      message.error("Failed to load reminders");
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchReminders();
  }, [planId]);

  useEffect(() => {
    if (planId) fetchSummary();
  }, [planId]);

  const statData = summary
    ? {
        noSmokingData: {
          value: `${summary.progress_days || 0} days`,
          icon: IoCheckmarkCircleOutline,
          label: "Recorded days",
        },
        savingsData: {
          value: `${
            summary.total_money_spent?.toLocaleString("vi-VN") || 0
          } VND`,
          icon: IoCheckmarkCircleOutline,
          label: "Money saved",
        },
        healthData: {
          value: `${summary.completion_rate || 0}%`,
          icon: IoCheckmarkCircleOutline,
          label: "Completion rate",
        },
      }
    : {};

  return (
    <div className={styles["progress-page-container"]}>
      <header>
        <h1>Quit Smoking Progress Tracking</h1>
        <p>Update daily and monitor your improvement</p>
        {summary?.latest_progress_date && (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            Last update:{" "}
            {new Date(summary.latest_progress_date).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        )}
      </header>

      {summary && (
        <StatCards
          noSmokingData={statData.noSmokingData}
          savingsData={statData.savingsData}
          healthData={statData.healthData}
        />
      )}
      {membershipPackageCode === "pro" && (
        <>
          <CreateReminderForm planId={planId} onCreated={fetchReminders} />
          <ReminderList reminders={reminders} onDelete={fetchReminders} />
        </>
      )}

      <section className={styles["progress-section"]}>
        <h2> Stages and Daily Records</h2>
        <QuitPlanStages planId={planId} onProgressRecorded={fetchSummary} />
      </section>
    </div>
  );
};

export default ProgressPage;
