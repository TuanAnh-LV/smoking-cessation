import React from "react";
import "./BadgeCard.scss";
import { IoMedalOutline } from "react-icons/io5";

const BadgeCard = ({ icon, title, description, rarity, achievedDate }) => {
  return (
    <article className="badge-card">
      <div className="badge-card__icon">{icon || <IoMedalOutline />}</div>
      <h4 className="badge-card__title">{title}</h4>
      <p className="badge-card__description">{description}</p>
      <div className={`badge-card__rarity rarity-${rarity?.toLowerCase()}`}>
        {rarity}
      </div>
      {achievedDate && (
        <p className="badge-card__date">
          Achieved: {new Date(achievedDate).toLocaleDateString()}
        </p>
      )}
    </article>
  );
};

export default BadgeCard;
