import React, { useEffect, useState } from "react";
import "./QuitPlan.scss";
import { FaHeart } from "react-icons/fa";
import CardPlan from "../../components/cardPlan/CardPlan";
import ImplementationTime from "../../components/ImplementationTime/ImplementationTime";
import Coach from "../../components/coach/coach";
import { SmokingStatusService } from "../../services/smokingStatus.service";
import { QuitPlanService } from "../../services/quitPlan.service";
import { UserService } from "../../services/user.service";
import { useAuth } from "../../context/authContext";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { QuitGoalDraftService } from "../../services/quitGoal.service";
const QuitPlan = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [latestStatus, setLatestStatus] = useState(null);
  const [stageSuggestion, setStageSuggestion] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const { userInfo } = useAuth();
  const [membershipPackageCode, setMembershipPackageCode] = useState(null);
  const [goal, setGoal] = useState("");
  // const [note, setNote] = useState("");
  const [reasons, setReasons] = useState([]);
  const [reasonsDetail, setReasonsDetail] = useState("");
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const navigate = useNavigate();
  const [customMaxCigs, setCustomMaxCigs] = useState([]);

  const reasonOptions = [
    "Health for yourself and your family",
    "Save costs",
    "Improve appearance",
    "Set an example for your children",
    "Increase confidence",
    "Improves mouth and teeth odor",
    "Long-lasting stress relief",
    "Other",
  ];

  const handleReasonChange = (e) => {
    const { value, checked } = e.target;
    setReasons((prev) =>
      checked ? [...prev, value] : prev.filter((r) => r !== value)
    );
  };

  useEffect(() => {
    SmokingStatusService.getLatestPrePlanStatus()
      .then((res) => {
        setLatestStatus(res);
        const { cigarette_count, suction_frequency } = res;

        if (cigarette_count <= 5 && suction_frequency === "light") {
          setStageSuggestion(
            "\ud83d\udca1 Suggested: 2 stages (Reduce → Quit)"
          );
        } else if (cigarette_count <= 15 || suction_frequency === "medium") {
          setStageSuggestion(
            "\ud83d\udca1 Suggested: 3 stages (Cut down → Quit → Maintain)"
          );
        } else {
          setStageSuggestion(
            "\ud83d\udca1 Suggested: 4 stages (Reduce gradually → Quit → Sustain)"
          );
        }
      })
      .catch(() => {
        setStageSuggestion(
          "\u2139\ufe0f No smoking status found. A default 3-stage plan will be used."
        );
      });
  }, []);

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        if (!userInfo?._id) return;
        const res = await UserService.getUserMembership(userInfo._id);
        const code = res?.data?.package_id?.type;
        setMembershipPackageCode(code);
      } catch (err) {
        console.error("Failed to fetch membership", err);
      }
    };

    fetchMembership();
  }, [userInfo]);
  useEffect(() => {
    const fetchGoalDraft = async () => {
      try {
        const res = await QuitGoalDraftService.getGoalDraft();
        const draft = res?.data;
        console.log("Goal draft res:", draft);

        if (!res) return;

        // So sánh user_id từ API với user đang đăng nhập
        if (draft.user_id === userInfo?._id) {
          if (draft.goal) setGoal(draft.goal);
        }
      } catch (err) {
        console.error("Failed to load goal draft", err);
      }
    };

    fetchGoalDraft();
  }, [userInfo]);
  const handleSavePlan = async () => {
    if (!startDate || isNaN(startDate.getTime())) {
      message.error("Please select a valid start date");
      return;
    }
    if (!goal) {
      message.error("Please select your quit goal");
      return;
    }

    // (Tùy chọn) Cảnh báo nếu không chọn lý do nào
    if (reasons.length === 0) {
      message.warning("You haven’t selected any reasons for quitting.");
    }
    try {
      setIsSaving(true);

      const startDateISO = startDate.toISOString();

      const res = await QuitPlanService.createQuitPlan({
        goal,
        start_date: startDateISO,
        // note,
        coach_user_id: selectedCoachId || null,
        reasons,
        reasons_detail: reasonsDetail,
        custom_max_values: customMaxCigs,
      });

      localStorage.setItem("currentPlanId", res.data.plan._id);
      window.dispatchEvent(new Event("storage"));
      navigate(`/progress/${res.data.plan._id}`);
      message.success("Quit plan created successfully!");
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "Failed to create quit plan.";
      message.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="quit-plan-page">
      <h1 className="title">Make a plan to quit smoking</h1>
      <p className="subtitle">
        Create a smoking cessation plan that fits your situation and goals
      </p>

      {stageSuggestion && (
        <div className="suggestion-box">{stageSuggestion}</div>
      )}

      <div className="form-grid">
        <div className="reasons-card">
          <div className="reasons-header">
            <span className="icon">
              <FaHeart />
            </span>
            <span className="reasons-title">Reasons for quitting smoking</span>
          </div>
          <div className="reasons-list">
            {reasonOptions.map((reason, idx) => (
              <label className="reason-item" key={idx}>
                <input
                  type="checkbox"
                  value={reason}
                  checked={reasons.includes(reason)}
                  onChange={handleReasonChange}
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>
          <textarea
            className="reasons-textarea"
            placeholder="Describe in detail your reasons..."
            value={reasonsDetail}
            onChange={(e) => setReasonsDetail(e.target.value)}
          />
        </div>

        <div className="goal-card">
          <h3>Your goal</h3>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 500,
              marginTop: "6px",
              padding: "10px",
            }}
          >
            {goal || "No goal selected yet"}
          </div>
        </div>
      </div>

      <ImplementationTime
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
      />

      <CardPlan
        selectedStartDate={startDate}
        onLastStageEndDate={setEndDate}
        onUpdateCustomMaxValues={setCustomMaxCigs}
      />

      {membershipPackageCode === "pro" && (
        <>
          <Coach setSelectedCoachId={setSelectedCoachId} />
        </>
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          className="save-button"
          onClick={handleSavePlan}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save plan"}
        </button>
      </div>
    </div>
  );
};

export default QuitPlan;
