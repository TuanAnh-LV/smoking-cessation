import React from "react";
import "./BadgeCard.scss";
import { IoMedalOutline } from "react-icons/io5"; // Fallback icon

const BadgeCard = ({ icon, title, description, rarity, achievedDate }) => {
  return (
    <div className="badge-card">
      <div className="badge-icon">{icon || <IoMedalOutline />}</div>
      <h4 className="badge-title">{title}</h4>
      <p className="badge-description">{description}</p>
      <div className={`badge-rarity rarity-${rarity?.toLowerCase()}`}>
        {rarity}
      </div>
      {achievedDate && (
        <p className="badge-achieved-date">
          Achieved: {new Date(achievedDate).toLocaleDateString()}
        </p>
      )}
      <button className="share-button">Share</button>
    </div>
  );
};

export default BadgeCard;
