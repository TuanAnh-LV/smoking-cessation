import React, { useEffect, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { QuitStageService } from "../../services/quitState.service";
import { QuitPlanProgressService } from "../../services/quitPlanProgress.service";
import StageChart from "./StageChart";
import "./QuitPlanStages.scss";

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-GB");

const statusLabelMap = {
  in_progress: "Ongoing",
  completed: "Completed",
  not_started: "Upcoming",
};

const QuitPlanStages = ({ planId, onProgressRecorded }) => {
  const [stages, setStages] = useState([]);
  const [inputData, setInputData] = useState({});
  const [openStageId, setOpenStageId] = useState(null);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  const fetchStages = async () => {
    try {
      const stageRes = await QuitStageService.getAllStagesOfPlan(planId);
      setStages(stageRes.data || []);
    } catch (err) {
      message.error("Failed to load stages");
    }
  };

  useEffect(() => {
    if (!planId) return;
    fetchStages();
  }, [planId]);

  const handleInputChange = (stageId, field, value) => {
    setInputData((prev) => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (stageId) => {
    const { cigarette_count = 0, note = "" } = inputData[stageId] || {};

    try {
      const res = await QuitPlanProgressService.recordProgress(planId, stageId, {
        cigarette_count: Number(cigarette_count),
        note,
      });

      if (res?.data?.cancelled) {
        message.error(res.data.message);
        localStorage.removeItem("currentPlanId");
        setTimeout(() => navigate("/status"), 1000);
        return;
      }

      if (res?.data?.warning) {
        message.warning(res.data.message);
      } else {
        message.success("Today's cigarette count recorded successfully.");
      }

      await fetchStages();
      onProgressRecorded?.();
    } catch (err) {
      message.error(
        err?.error?.response?.data?.message ||
          err?.error?.response?.data?.error ||
          err?.message ||
          "Failed to record progress"
      );
    }
  };

  const handleStageClick = async (stageId) => {
    if (openStageId === stageId) {
      setOpenStageId(null);
      return;
    }

    try {
      const res = await QuitPlanProgressService.getStageProgress(stageId);
      const formatted = res.data.map((progress) => ({
        date: new Date(progress.date).toLocaleDateString("vi-VN"),
        cigarettes: progress.cigarette_count,
      }));

      setChartData(formatted);
      setOpenStageId(stageId);
    } catch (err) {
      message.error("Failed to load progress data");
    }
  };

  return (
    <div className="quit-plan-stages">
      {stages.map((stage) => {
        const { _id, name, description, start_date, end_date, status, recordedToday } =
          stage;
        const disabled = recordedToday || status !== "in_progress";
        const input = inputData[_id] || {};

        return (
          <article key={_id} className={`quit-plan-stage quit-plan-stage--${status}`}>
            <button
              type="button"
              className="quit-plan-stage__summary"
              onClick={() => handleStageClick(_id)}
            >
              <div>
                <span className="quit-plan-stage__status">
                  {statusLabelMap[status]}
                </span>
                <h3>{name}</h3>
                <p className="quit-plan-stage__date">
                  {formatDate(start_date)} to {formatDate(end_date)}
                </p>
              </div>

              <div className="quit-plan-stage__meta">
                <span>
                  {stage.progressDays} / {stage.totalDays} days
                </span>
                <strong>Max {stage.max_daily_cigarette}/day</strong>
              </div>
            </button>

            <div className="quit-plan-stage__body">
              <p className="quit-plan-stage__description">{description}</p>

              {status === "in_progress" && (
                <div className="quit-plan-stage__form">
                  <div className="quit-plan-stage__field">
                    <label htmlFor={`cigarettes-${_id}`}>Today&apos;s cigarette count</label>
                    <input
                      id={`cigarettes-${_id}`}
                      type="number"
                      placeholder="0"
                      disabled={disabled}
                      value={input.cigarette_count || ""}
                      onChange={(e) =>
                        handleInputChange(_id, "cigarette_count", e.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSubmit(_id)}
                    disabled={disabled}
                    className="quit-plan-stage__submit"
                  >
                    {disabled ? "Recorded today" : "Record progress"}
                  </button>
                </div>
              )}

              {openStageId === _id && <StageChart data={chartData} />}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default QuitPlanStages;
