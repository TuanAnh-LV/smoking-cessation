import React, { useEffect, useState } from "react";
import "./coach.scss"; // We will create this file next
import { CoachService } from "../../services/coach.service";
const Coach = ({ setSelectedCoachId }) => {
  const [coaches, setCoaches] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await CoachService.getAllCoaches();
        setCoaches(res.data);
      } catch (err) {
        console.error("Failed to fetch coaches", err);
      }
    };

    fetchCoaches();
  }, []);

  const handleSelectCoach = (id) => {
    setSelectedId(id);
    setSelectedCoachId(id); // Truyền lên QuitPlan
  };

  return (
    <div className="coach-section-container">
      <h2>Select Your Coach</h2>
      <div className="coach-cards-container">
        {coaches.map((coach) => (
          <div
            key={coach._id}
            className={`coach-card ${
              selectedId === coach._id ? "selected" : ""
            }`}
            onClick={() => handleSelectCoach(coach._id)}
          >
            <img
              src={coach.avatar || "/default-avatar.jpg"}
              alt={coach.full_name}
            />
            <div className="coach-info">
              <h3>{coach.full_name}</h3>
              <p>{coach.email}</p>
              <div className="coach-rating">★★★★☆ 4/5</div>
              {selectedId === coach._id && (
                <div className="selected-label">Selected</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coach;
