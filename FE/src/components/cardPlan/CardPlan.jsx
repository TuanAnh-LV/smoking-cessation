import React, { useEffect, useState } from "react";
import { GrPlan } from "react-icons/gr";
import { QuitPlanService } from "../../services/quitPlan.service";
import "./CardPlan.scss";

const CardPlan = ({
  selectedStartDate,
  onLastStageEndDate,
  onUpdateCustomMaxValues,
  isLoading = false,
}) => {
  const [suggestedStages, setSuggestedStages] = useState([]);
  const [maxCigsByStage, setMaxCigsByStage] = useState([]);

  useEffect(() => {
    if (!selectedStartDate) {
      setSuggestedStages([]);
      setMaxCigsByStage([]);
      return;
    }

    QuitPlanService.getSuggestedQuitPlan()
      .then((res) => {
        const stages = res?.suggested_stages || res?.data?.suggested_stages || [];
        const parsedStages = stages.map((stage) => {
          const start = new Date(stage.start_date);
          const end = new Date(stage.end_date);

          return {
            ...stage,
            start_date_obj: Number.isNaN(start.getTime()) ? null : start,
            end_date_obj: Number.isNaN(end.getTime()) ? null : end,
          };
        });

        setSuggestedStages(parsedStages);
        setMaxCigsByStage(
          parsedStages.map((stage) => stage.max_daily_cigarette ?? 0)
        );

        if (parsedStages.length > 0 && onLastStageEndDate) {
          onLastStageEndDate(parsedStages[parsedStages.length - 1].end_date_obj);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch suggested stages", err);
      });
  }, [selectedStartDate, onLastStageEndDate]);

  useEffect(() => {
    if (onUpdateCustomMaxValues) {
      onUpdateCustomMaxValues(maxCigsByStage);
    }
  }, [maxCigsByStage, onUpdateCustomMaxValues]);

  const getTotalDays = () => {
    if (suggestedStages.length === 0) return 0;
    const firstDate = suggestedStages[0].start_date_obj;
    const lastDate = suggestedStages[suggestedStages.length - 1].end_date_obj;

    if (!firstDate || !lastDate) return 0;
    return Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <section className="card-plan">
      <div className="card-plan__header">
        <span className="card-plan__icon">
          <GrPlan />
        </span>
        <div>
          <h2>Suggested structure</h2>
          <p>We generate stages from your smoking data, then you fine-tune the daily limits.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="card-plan__skeleton">
          <div className="card-plan__skeleton-summary">
            <div className="card-plan__skeleton-box"></div>
            <div className="card-plan__skeleton-box"></div>
          </div>
          <div className="card-plan__skeleton-grid">
            <div className="card-plan__skeleton-stage"></div>
            <div className="card-plan__skeleton-stage"></div>
            <div className="card-plan__skeleton-stage"></div>
          </div>
        </div>
      ) : !selectedStartDate ? (
        <div className="card-plan__empty">
          Please select a start date to preview your personalized plan.
        </div>
      ) : (
        <>
          <div className="card-plan__summary">
            <div className="card-plan__summary-item">
              <span>Estimated duration</span>
              <strong>{getTotalDays()} days</strong>
            </div>
            <div className="card-plan__summary-item">
              <span>Total stages</span>
              <strong>{suggestedStages.length}</strong>
            </div>
          </div>

          <div className="card-plan__grid">
            {suggestedStages.map((stage, index) => (
              <article className="card-plan__stage" key={`${stage.name}-${index}`}>
                <div className="card-plan__stage-top">
                  <span className="card-plan__stage-index">Stage {index + 1}</span>
                  <h3>{stage.name}</h3>
                  <p>
                    {stage.start_date_obj?.toLocaleDateString("vi-VN")} to{" "}
                    {stage.end_date_obj?.toLocaleDateString("vi-VN")}
                  </p>
                </div>

                <div className="card-plan__stage-body">
                  {stage.description?.split("\n").map((line, lineIndex) => (
                    <p key={lineIndex}>{line}</p>
                  ))}
                </div>

                <div className="card-plan__field">
                  <label htmlFor={`max-cigarettes-${index}`}>Max cigarettes/day</label>
                  <input
                    id={`max-cigarettes-${index}`}
                    type="number"
                    value={maxCigsByStage[index] ?? 0}
                    onChange={(e) => {
                      const nextValues = [...maxCigsByStage];
                      nextValues[index] = Number(e.target.value);
                      setMaxCigsByStage(nextValues);
                    }}
                    min={0}
                  />
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default CardPlan;
