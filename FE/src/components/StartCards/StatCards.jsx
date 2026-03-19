import React from "react";
import { Link } from "react-router-dom";
import "./StatCards.scss";

const cards = ["warm", "sand", "dark"];

const renderCard = (item, fallbackTone) => {
  const tone = item?.tone || fallbackTone;
  const content = (
    <>
      {item.icon && React.createElement(item.icon, { className: "stat-card__icon" })}
      <h2>{item.value}</h2>
      <p>{item.label}</p>
    </>
  );

  const className = `stat-card stat-card--${tone}`;

  if (item.linkTo) {
    return (
      <Link to={item.linkTo} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};

const StatCards = ({ noSmokingData, savingsData, healthData }) => {
  const items = [noSmokingData, savingsData, healthData];

  return (
    <section className="stat-cards">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {renderCard(item, cards[index])}
        </React.Fragment>
      ))}
    </section>
  );
};

export default StatCards;
