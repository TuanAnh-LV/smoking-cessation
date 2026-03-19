import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { FaHeart } from "react-icons/fa";
import { SmokingStatusService } from "../../services/smokingStatus.service";
import { QuitPlanService } from "../../services/quitPlan.service";
import { UserService } from "../../services/user.service";
import { QuitGoalDraftService } from "../../services/quitGoal.service";
import { useAuth } from "../../context/authContext";
import CardPlan from "../../components/cardPlan/CardPlan";
import ImplementationTime from "../../components/ImplementationTime/ImplementationTime";
import Coach from "../../components/coach/coach";
import "./QuitPlan.scss";

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

const QuitPlan = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [stageSuggestion, setStageSuggestion] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [membershipPackageCode, setMembershipPackageCode] = useState(null);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(true);
  const [isMembershipLoading, setIsMembershipLoading] = useState(true);
  const [isGoalLoading, setIsGoalLoading] = useState(true);
  const [goal, setGoal] = useState("");
  const [reasons, setReasons] = useState([]);
  const [reasonsDetail, setReasonsDetail] = useState("");
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [customMaxCigs, setCustomMaxCigs] = useState([]);
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const handleReasonChange = (e) => {
    const { value, checked } = e.target;
    setReasons((prev) =>
      checked ? [...prev, value] : prev.filter((reason) => reason !== value),
    );
  };

  useEffect(() => {
    SmokingStatusService.getLatestPrePlanStatus()
      .then((res) => {
        const statusData = res?.data || res;
        const cigaretteCount = statusData?.cigarette_count ?? 0;
        const suctionFrequency = statusData?.suction_frequency;

        if (cigaretteCount <= 5 && suctionFrequency === "light") {
          setStageSuggestion("Suggested: 2 stages for a faster transition.");
        } else if (cigaretteCount <= 15 || suctionFrequency === "medium") {
          setStageSuggestion(
            "Suggested: 3 stages to reduce gradually and hold momentum.",
          );
        } else {
          setStageSuggestion(
            "Suggested: 4 stages for a steadier and more sustainable reduction.",
          );
        }
      })
      .catch(() => {
        setStageSuggestion(
          "No smoking status was found yet. A balanced default structure will be used.",
        );
      })
      .finally(() => {
        setIsSuggestionLoading(false);
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
      } finally {
        setIsMembershipLoading(false);
      }
    };

    if (userInfo?._id) {
      fetchMembership();
    } else {
      setIsMembershipLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchGoalDraft = async () => {
      try {
        const res = await QuitGoalDraftService.getGoalDraft();
        const draft = res?.data;

        if (draft?.user_id === userInfo?._id && draft?.goal) {
          setGoal(draft.goal);
        }
      } catch (err) {
        console.error("Failed to load goal draft", err);
      } finally {
        setIsGoalLoading(false);
      }
    };

    if (userInfo?._id) {
      fetchGoalDraft();
    } else {
      setIsGoalLoading(false);
    }
  }, [userInfo]);

  const handleSavePlan = async () => {
    if (!startDate || Number.isNaN(startDate.getTime())) {
      message.error("Please select a valid start date.");
      return;
    }

    if (!goal) {
      message.error("Please complete your quit goal before creating a plan.");
      return;
    }

    if (reasons.length === 0) {
      message.warning("You have not selected any reasons for quitting yet.");
    }

    try {
      setIsSaving(true);

      const res = await QuitPlanService.createQuitPlan({
        goal,
        start_date: startDate.toISOString(),
        coach_user_id: selectedCoachId || null,
        reasons,
        reasons_detail: reasonsDetail,
        custom_max_values: customMaxCigs,
      });

      const createdPlanId = res?.data?.plan?._id;
      if (createdPlanId) {
        localStorage.setItem("currentPlanId", createdPlanId);
        window.dispatchEvent(new Event("storage"));
        message.success("Quit plan created successfully.");
        navigate(`/progress/${createdPlanId}`);
        return;
      }

      message.error("Plan was created, but no plan id was returned.");
    } catch (err) {
      const errorMessage =
        err?.error?.response?.data?.error ||
        err?.error?.response?.data?.message ||
        err?.message ||
        "Failed to create quit plan.";
      message.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="quit-plan-page">
      <section className="quit-plan-hero">
        <span className="quit-plan-hero__eyebrow">PERSONAL PLAN</span>
        <h1 className="quit-plan-hero__title">
          Build a quit plan that fits your pace.
        </h1>
        <p className="quit-plan-hero__description">
          Review your goal, define the reasons that matter most, and shape a
          step-by-step roadmap that feels realistic enough to follow through.
        </p>
      </section>

      {(isSuggestionLoading || stageSuggestion) && (
        <section className="quit-plan-banner">
          {isSuggestionLoading ? (
            <div className="quit-plan-banner__skeleton"></div>
          ) : (
            <>
              <span className="quit-plan-banner__label">Plan suggestion</span>
              <p>{stageSuggestion}</p>
            </>
          )}
        </section>
      )}

      <section className="quit-plan-overview">
        <div className="quit-plan-card quit-plan-card--reasons">
          <div className="quit-plan-card__header">
            <span className="quit-plan-card__icon">
              <FaHeart />
            </span>
            <div>
              <h2>Why are you quitting?</h2>
              <p>Pick the motivations you want this plan to reinforce.</p>
            </div>
          </div>

          {isGoalLoading ? (
            <div className="quit-plan-reasons-skeleton">
              {reasonOptions.map((reason) => (
                <div className="quit-plan-reason-skeleton" key={reason}></div>
              ))}
              <div className="quit-plan-textarea-skeleton"></div>
            </div>
          ) : (
            <>
              <div className="quit-plan-reasons">
                {reasonOptions.map((reason) => (
                  <label className="quit-plan-reason" key={reason}>
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
                className="quit-plan-textarea"
                placeholder="Add personal context, triggers, or anything you want this plan to account for."
                value={reasonsDetail}
                onChange={(e) => setReasonsDetail(e.target.value)}
              />
            </>
          )}
        </div>

        <div className="quit-plan-card quit-plan-card--goal">
          <div className="quit-plan-card__header">
            <div>
              <h2>Your current goal</h2>
              <p>This goal is pulled from the setup you completed earlier.</p>
            </div>
          </div>

          {isGoalLoading || isMembershipLoading ? (
            <div className="quit-plan-goal-skeleton">
              <div className="quit-plan-goal-skeleton__box"></div>
              <div className="quit-plan-goal-skeleton__summary">
                <div className="quit-plan-goal-skeleton__item"></div>
                <div className="quit-plan-goal-skeleton__item"></div>
              </div>
            </div>
          ) : (
            <>
              <div className={`quit-plan-goal ${goal ? "has-goal" : ""}`}>
                {goal ? goal.replaceAll("_", " ") : "No goal selected yet"}
              </div>

              <div className="quit-plan-summary">
                <div className="quit-plan-summary__item">
                  <span>Selected reasons</span>
                  <strong>{reasons.length}</strong>
                </div>
                <div className="quit-plan-summary__item">
                  <span>Coach support</span>
                  <strong>
                    {membershipPackageCode === "pro" ? "Available" : "Standard"}
                  </strong>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <ImplementationTime
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        isLoading={isGoalLoading}
      />

      <CardPlan
        selectedStartDate={startDate}
        onLastStageEndDate={setEndDate}
        onUpdateCustomMaxValues={setCustomMaxCigs}
        isLoading={isGoalLoading}
      />

      {(isMembershipLoading || membershipPackageCode === "pro") && (
        <Coach
          setSelectedCoachId={setSelectedCoachId}
          isLoading={isMembershipLoading}
        />
      )}

      <div className="quit-plan-actions">
        <button
          className="quit-plan-save-button"
          onClick={handleSavePlan}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Create plan"}
        </button>
      </div>
    </div>
  );
};

export default QuitPlan;
