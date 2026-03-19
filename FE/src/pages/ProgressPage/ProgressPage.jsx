import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { QuitPlanService } from "../../services/quitPlan.service";
import { ReminderService } from "../../services/reminder.service";
import { UserService } from "../../services/user.service";
import { useAuth } from "../../context/authContext";
import StatCards from "../../components/StartCards/StatCards";
import QuitPlanStages from "../../components/progressTracking/QuitPlanStages";
import CreateReminderForm from "../../components/progressTracking/CreateReminderForm";
import ReminderList from "../../components/progressTracking/ReminderList";
import "./ProgressPage.scss";

const ProgressPage = () => {
  const [summary, setSummary] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [membershipPackageCode, setMembershipPackageCode] = useState("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isRemindersLoading, setIsRemindersLoading] = useState(false);
  const [isMembershipLoading, setIsMembershipLoading] = useState(true);
  const { id: planId } = useParams();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermission = async () => {
      try {
        setIsMembershipLoading(true);
        const res = await UserService.getUserMembership(userInfo._id);
        const code = res?.data?.package_id?.type;
        setMembershipPackageCode(code);
      } catch (err) {
        console.error("Cannot load membership permission:", err);
      } finally {
        setIsMembershipLoading(false);
      }
    };

    if (userInfo?._id) {
      checkPermission();
    }
  }, [userInfo?._id]);

  const fetchSummary = async () => {
    try {
      setIsSummaryLoading(true);
      const res = await QuitPlanService.getPlanSummary(planId);
      setSummary(res.data);
    } catch (err) {
      console.error("Error loading summary data", err);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const fetchReminders = async () => {
    try {
      setIsRemindersLoading(true);
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
    } finally {
      setIsRemindersLoading(false);
    }
  };

  useEffect(() => {
    if (!planId) return;
    fetchSummary();
    fetchReminders();
  }, [planId]);

  const statData = summary
    ? {
        noSmokingData: {
          value: `${summary.progress_days || 0} days`,
          icon: IoCheckmarkCircleOutline,
          label: "Recorded days",
          tone: "warm",
        },
        savingsData: {
          value: `${summary.total_money_spent?.toLocaleString("vi-VN") || 0} VND`,
          icon: IoCheckmarkCircleOutline,
          label: "Money saved",
          tone: "sand",
        },
        healthData: {
          value: `${summary.completion_rate || 0}%`,
          icon: IoCheckmarkCircleOutline,
          label: "Completion rate",
          tone: "dark",
        },
      }
    : null;

  return (
    <div className="progress-page">
      <section className="progress-page__hero">
        <h1>Follow your quit journey day by day.</h1>
        <p>
          Review your latest progress, keep reminders close, and record each
          stage with a clearer timeline and cleaner dashboard.
        </p>

        {summary?.latest_progress_date && (
          <div className="progress-page__last-update">
            Last update:{" "}
            {new Date(summary.latest_progress_date).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        )}
      </section>

      {(isSummaryLoading || summary) && (
        <section className="progress-page__stats">
          {isSummaryLoading ? (
            <div className="progress-page__stats-skeleton">
              <div className="progress-skeleton-card"></div>
              <div className="progress-skeleton-card"></div>
              <div className="progress-skeleton-card"></div>
            </div>
          ) : (
            <StatCards
              noSmokingData={statData.noSmokingData}
              savingsData={statData.savingsData}
              healthData={statData.healthData}
            />
          )}
        </section>
      )}

      {(isMembershipLoading || membershipPackageCode === "pro") && (
        <section className="progress-page__reminders">
          <div className="progress-page__section-header">
            <h2>Reminders</h2>
            <p>Keep supportive prompts scheduled while your plan is active.</p>
          </div>

          {isMembershipLoading || isRemindersLoading ? (
            <div className="progress-page__reminders-skeleton">
              <div className="progress-skeleton-line progress-skeleton-line--button"></div>
              <div className="progress-skeleton-panel">
                <div className="progress-skeleton-line progress-skeleton-line--title"></div>
                <div className="progress-skeleton-line"></div>
                <div className="progress-skeleton-line"></div>
                <div className="progress-skeleton-grid">
                  <div className="progress-skeleton-line"></div>
                  <div className="progress-skeleton-line"></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <CreateReminderForm planId={planId} onCreated={fetchReminders} />
              <ReminderList reminders={reminders} onDelete={fetchReminders} />
            </>
          )}
        </section>
      )}

      <section className="progress-page__stages">
        <div className="progress-page__section-header">
          <h2>Stages and daily records</h2>
          <p>Open a stage to review its trend and log today&apos;s result.</p>
        </div>
        {isSummaryLoading ? (
          <div className="progress-page__stages-skeleton">
            <div className="progress-skeleton-stage"></div>
            <div className="progress-skeleton-stage"></div>
            <div className="progress-skeleton-stage"></div>
          </div>
        ) : (
          <QuitPlanStages planId={planId} onProgressRecorded={fetchSummary} />
        )}
      </section>
    </div>
  );
};

export default ProgressPage;
