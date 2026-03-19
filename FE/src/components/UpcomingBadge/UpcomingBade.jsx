import React from "react";
import "./UpcomingBade.scss";

const UpcomingBade = ({ icon, title, description, rarity }) => {
  return (
    <article className="upcoming-badge-card">
      <div className="upcoming-badge-card__icon">{icon}</div>
      <h3 className="upcoming-badge-card__title">{title}</h3>
      <p className="upcoming-badge-card__description">{description}</p>
      <p className={`upcoming-badge-card__rarity rarity-${rarity.toLowerCase()}`}>
        {rarity}
      </p>
      <p className="upcoming-badge-card__status">Not yet achieved</p>
    </article>
  );
};

export default UpcomingBade;
