import React from "react";
import styles from "../../pages/ProgressPage/ProgressPage.module.css";
import { Link } from "react-router-dom";
const StatCards = ({ noSmokingData, savingsData, healthData }) => {
  return (
    <section className={styles["stats-section"]}>
      <Link to={noSmokingData.linkTo} className={`${styles["stat-card"]}`}>
        {noSmokingData.icon &&
          React.createElement(noSmokingData.icon, { className: styles.icon })}

        <h2>{noSmokingData.value}</h2>
        <p>{noSmokingData.label}</p>
      </Link>

      <Link
        to={savingsData.linkTo}
        className={`${styles["stat-card"]} ${styles["stat-card-2"]}`}
      >
        {savingsData.icon &&
          React.createElement(savingsData.icon, { className: styles.icon })}

        <h2>{savingsData.value}</h2>
        <p>{savingsData.label}</p>
      </Link>

      <Link
        to={healthData.linkTo}
        className={`${styles["stat-card"]} ${styles["stat-card-3"]}`}
      >
        {healthData.icon &&
          React.createElement(healthData.icon, { className: styles.icon })}

        <h2>{healthData.value}</h2>
        <p>{healthData.label}</p>
      </Link>
    </section>
  );
};

export default StatCards;
