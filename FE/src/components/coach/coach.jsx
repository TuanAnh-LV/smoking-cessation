import React, { useEffect, useState } from "react";
import { CoachService } from "../../services/coach.service";
import "./coach.scss";

const Coach = ({ setSelectedCoachId, isLoading = false }) => {
  const [coaches, setCoaches] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await CoachService.getAllCoaches();
        setCoaches(res?.data || []);
      } catch (err) {
        console.error("Failed to fetch coaches", err);
      }
    };

    fetchCoaches();
  }, []);

  const handleSelectCoach = (id) => {
    setSelectedId(id);
    setSelectedCoachId(id);
  };

  return (
    <section className="coach-section">
      <div className="coach-section__header">
        <h2>Choose a coach</h2>
        <p>Pro members can pair their quit plan with a coach for closer support.</p>
      </div>

      <div className="coach-section__grid">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div className="coach-card coach-card--skeleton" key={index}>
                <div className="coach-card__image-skeleton"></div>
                <div className="coach-card__content">
                  <div className="coach-card__line coach-card__line--tag"></div>
                  <div className="coach-card__line coach-card__line--title"></div>
                  <div className="coach-card__line"></div>
                  <div className="coach-card__meta">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            ))
          : coaches.map((coach) => (
          <button
            key={coach._id}
            type="button"
            className={`coach-card ${selectedId === coach._id ? "selected" : ""}`}
            onClick={() => handleSelectCoach(coach._id)}
          >
            <img
              src={coach.avatar || "/default-avatar.jpg"}
              alt={coach.full_name}
            />

            <div className="coach-card__content">
              <div className="coach-card__top">
                <span className="coach-card__tag">
                  {selectedId === coach._id ? "Selected" : "Available"}
                </span>
                <h3>{coach.full_name}</h3>
                <p>{coach.email}</p>
              </div>

              <div className="coach-card__meta">
                <span>1:1 support</span>
                <span>Plan follow-up</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Coach;
