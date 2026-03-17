import React, { useState, useEffect } from "react";
import "./StatusPage.scss";
import { FaSmoking } from "react-icons/fa";
import { SmokingStatusService } from "../../services/smokingStatus.service";
import { useNavigate } from "react-router-dom";
import { QuitGoalDraftService } from "../../services/quitGoal.service";
import { message } from "antd";
const StatusPage = () => {
  const [cigarettesPerDay, setCigarettesPerDay] = useState("");
  const [suctionFrequency, setSuctionFrequency] = useState("");
  const [pricePerPackage, setPricePerPackage] = useState("");
  const [packsPerWeek, setPacksPerWeek] = useState("");

  const [monthlyExpenses, setMonthlyExpenses] = useState("0");
  const [annualCosts, setAnnualCosts] = useState("0");
  const [cigarettesPerYear, setCigarettesPerYear] = useState("0");

  const [goal, setGoal] = useState("");
  const [isGoalSaved, setIsGoalSaved] = useState(false);
  const [goalError, setGoalError] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const count = parseInt(cigarettesPerDay);
    if (!isNaN(count)) {
      if (count <= 5) setSuctionFrequency("light");
      else if (count <= 15) setSuctionFrequency("medium");
      else setSuctionFrequency("heavy");
    } else {
      setSuctionFrequency("");
    }
  }, [cigarettesPerDay]);

  useEffect(() => {
    const numCigarettesPerDay = parseFloat(cigarettesPerDay) || 0;
    const numPricePerPackage = parseFloat(pricePerPackage) || 0;
    const numPacksPerWeek = parseFloat(packsPerWeek) || 0;

    const monthly = numPacksPerWeek * numPricePerPackage;
    const annual = monthly * 12;
    const yearlyCigs = numCigarettesPerDay * 365;

    setMonthlyExpenses(monthly.toLocaleString("vi-VN"));

    setAnnualCosts(annual.toLocaleString("vi-VN"));

    setCigarettesPerYear(
      yearlyCigs.toLocaleString("vi-VN", { maximumFractionDigits: 0 })
    );
  }, [cigarettesPerDay, pricePerPackage, packsPerWeek]);

  const fetchGoal = async () => {
    try {
      const res = await QuitGoalDraftService.getGoalDraft();
      if (res?.data?.goal) {
        setGoal(res.data.goal);
        setIsGoalSaved(true);
      }

      setGoal(res?.data?.goal || "");
    } catch (err) {
      console.error(" Failed to fetch goal draft:", err);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  const handleSubmit = async () => {
    let newErrors = {};
    let hasError = false;

    if (!goal.trim()) {
      setGoalError("Please enter your quit goal before continuing.");
      hasError = true;
    } else {
      setGoalError("");
    }

    if (!cigarettesPerDay) {
      newErrors.cigarettesPerDay = "Required";
      hasError = true;
    } else if (isNaN(cigarettesPerDay) || parseFloat(cigarettesPerDay) <= 0) {
      newErrors.cigarettesPerDay = "Must be a valid number > 0";
      hasError = true;
    }

    if (!pricePerPackage) {
      newErrors.pricePerPackage = "Required";
      hasError = true;
    } else if (isNaN(pricePerPackage) || parseFloat(pricePerPackage) <= 0) {
      newErrors.pricePerPackage = "Must be a valid number > 0";
      hasError = true;
    }

    if (!packsPerWeek) {
      newErrors.packsPerWeek = "Required";
      hasError = true;
    } else if (isNaN(packsPerWeek) || parseFloat(packsPerWeek) <= 0) {
      newErrors.packsPerWeek = "Must be a valid number > 0";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // clear previous errors

    try {
      await SmokingStatusService.recordInitialSmokingStatus({
        cigarette_count: parseInt(cigarettesPerDay),
        price_per_pack: parseFloat(pricePerPackage),
        packs_per_week: parseFloat(packsPerWeek),
        time_of_smoking: new Date().toISOString(),
        suction_frequency: suctionFrequency,
        health_note: "",
      });

      navigate("/quit-plan");
    } catch (error) {
      console.error("Failed to record initial smoking status:", error);
    }
  };

  return (
    <div className="status-page">
      <h1 className="title">Smoking Status</h1>
      <p className="subtitle">
        Record and track smoking habits to create an effective smoking cessation
        plan
      </p>
      <div className="info-card">
        <div className="info-header">
          <span className="info-title">Your Quit Goal</span>
        </div>
        {isGoalSaved ? (
          <div className="text-gray-800 text-base">{goal}</div>
        ) : (
          <div>
            <div className="form-group">
              <label>Why do you want to quit smoking?</label>
              <textarea
                style={{ width: "100%" }}
                className="border border-gray-300 rounded-md p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Ex: For my health, family, or to save money..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={4}
              />
            </div>

            <button
              className="plan-btn"
              disabled={!goal.trim()}
              onClick={async () => {
                try {
                  await QuitGoalDraftService.createGoalDraft({
                    goal: goal.trim(),
                  });
                  setIsGoalSaved(true);
                  message.success("Goal saved!");
                  fetchGoal();
                } catch (err) {
                  console.error(err);
                  message.error("Failed to save goal.");
                }
              }}
            >
              Save Goal
            </button>
          </div>
        )}
      </div>
      <div className="info-card">
        <div className="info-header">
          <span className="icon" role="img" aria-label="smoke">
            <FaSmoking />
          </span>
          <span className="info-title">Current information</span>
        </div>

        <div className="info-form">
          <div className="form-group">
            <label>Number of cigarettes/day</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="10"
              value={cigarettesPerDay}
              onChange={(e) => setCigarettesPerDay(e.target.value)}
            />
            {errors.cigarettesPerDay && (
              <div style={{ color: "red", marginTop: "4px" }}>
                {errors.cigarettesPerDay}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Suction frequency</label>
            <select value={suctionFrequency} disabled>
              <option value="">Select Frequency</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="heavy">Heavy</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price/package (VND)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              placeholder="25.000"
              value={
                pricePerPackage === ""
                  ? ""
                  : parseFloat(pricePerPackage).toLocaleString("vi-VN")
              }
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                setPricePerPackage(raw);
              }}
            />

            {errors.pricePerPackage && (
              <div style={{ color: "red", marginTop: "4px" }}>
                {errors.pricePerPackage}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Number of packs/week</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="3.5"
              value={packsPerWeek}
              onChange={(e) => setPacksPerWeek(e.target.value)}
            />
            {errors.packsPerWeek && (
              <div style={{ color: "red", marginTop: "4px" }}>
                {errors.packsPerWeek}
              </div>
            )}
          </div>
        </div>

        <button
          className="plan-btn"
          // disabled={!isFormValid()}
          onClick={handleSubmit}
        >
          Make a Plan
        </button>

        {goalError && (
          <div style={{ color: "red", marginTop: "12px", fontSize: "0.95rem" }}>
            {goalError}
          </div>
        )}
      </div>

      <div className="summary-row">
        <div className="summary-box">
          <div>Monthly expenses</div>
          <div className="summary-value">{monthlyExpenses} VNĐ</div>
        </div>
        <div className="summary-box">
          <div>Annual costs</div>
          <div className="summary-value">{annualCosts} VNĐ</div>
        </div>
        <div className="summary-box">
          <div>Cigarettes/year</div>
          <div className="summary-value">{cigarettesPerYear}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
