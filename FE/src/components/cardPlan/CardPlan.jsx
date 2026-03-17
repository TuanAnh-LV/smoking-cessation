import React, { useEffect, useState } from "react";
import "./CardPlan.scss";
import { GrPlan } from "react-icons/gr";
import { QuitPlanService } from "../../services/quitPlan.service";

const CardPlan = ({
  selectedStartDate,
  onLastStageEndDate,
  onUpdateCustomMaxValues,
}) => {
  const [suggestedStages, setSuggestedStages] = useState([]);
  const [maxCigsByStage, setMaxCigsByStage] = useState([]);
  useEffect(() => {
    if (!selectedStartDate) {
      setSuggestedStages([]); // reset nếu chưa chọn ngày
      return;
    }

    QuitPlanService.getSuggestedQuitPlan()
      .then((res) => {
        const stages = res.suggested_stages || res.data?.suggested_stages || [];

        const parsedStages = stages.map((stage) => {
          const start = new Date(stage.start_date);
          const end = new Date(stage.end_date);

          return {
            ...stage,
            start_date_obj: isNaN(start.getTime()) ? null : start,
            end_date_obj: isNaN(end.getTime()) ? null : end,
          };
        });

        setSuggestedStages(parsedStages);
        setMaxCigsByStage(
          parsedStages.map((stage) => stage.max_daily_cigarette ?? 0)
        );

        if (parsedStages.length > 0 && onLastStageEndDate) {
          const last = parsedStages[parsedStages.length - 1];
          onLastStageEndDate(last.end_date_obj);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch suggested stages", err);
      });
  }, [selectedStartDate]);

  const getTotalDays = () => {
    if (suggestedStages.length === 0) return 0;
    const first = suggestedStages[0].start_date_obj;
    const last = suggestedStages[suggestedStages.length - 1].end_date_obj;
    if (!first || !last || isNaN(first) || isNaN(last)) return 0;

    const diffTime = last - first;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  useEffect(() => {
    if (onUpdateCustomMaxValues) {
      onUpdateCustomMaxValues(maxCigsByStage);
    }
  }, [maxCigsByStage]);

  return (
    <div className="plan-container">
      <div className="plan-title">
        <span className="calendar-icon">
          <GrPlan />
        </span>
        <h2>Suggested Plan Based on Your Smoking Data</h2>
      </div>
      <div className="plan-cards">
        <div
          className="card full-width"
          style={{ maxWidth: "1000px", width: "100%", margin: "0 auto" }}
        >
          <h3>Personalized Quit Plan</h3>
          {!selectedStartDate ? (
            <p className="text-center text-gray-500">
              Please select a start date to view your personalized plan.
            </p>
          ) : (
            <>
              <p className="time">Estimated duration: {getTotalDays()} days</p>
              <p>
                This plan is tailored to your smoking status and quitting goal.
              </p>
              <h4>Stages:</h4>
              <ul
                className="stage-row"
                style={{ justifyContent: "space-between" }}
              >
                {suggestedStages.map((stage, index) => (
                  <li className="stage-box" key={index}>
                    <div className="stage-item">
                      <div className="stage-name">
                        <strong>{stage.name}</strong>
                      </div>
                      <div className="stage-date">
                        ({stage.start_date_obj?.toLocaleDateString("vi-VN")} →{" "}
                        {stage.end_date_obj?.toLocaleDateString("vi-VN")})
                      </div>
                      <div className="stage-description">
                        {stage.description.split("\n").map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>

                      <div style={{ marginTop: "8px" }}>
                        <label style={{ fontWeight: 500 }}>
                          Max cigarettes/day:{" "}
                        </label>
                        <input
                          type="number"
                          value={maxCigsByStage[index]}
                          onChange={(e) => {
                            const newVals = [...maxCigsByStage];
                            newVals[index] = Number(e.target.value);
                            setMaxCigsByStage(newVals);
                          }}
                          min={0}
                          style={{ width: "60px", marginLeft: "8px" }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardPlan;
