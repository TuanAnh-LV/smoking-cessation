import React, { useEffect, useState } from "react";
import { BadgeService } from "../../services/badge.service";
import StatCards from "../../components/StartCards/StatCards";
import "./AchievementPage.scss";
import { IoMedalOutline, IoStar } from "react-icons/io5";
import { RiBookmarkLine } from "react-icons/ri";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import BadgeCard from "../../components/BadgeCard/BadgeCard";
import UpcomingBade from "../../components/UpcomingBadge/UpcomingBade";

const AchievementPage = () => {
  const [achievedBadges, setAchievedBadges] = useState([]);
  const [upcomingBadges, setUpcomingBadges] = useState([]);
  const [statData, setStatData] = useState({
    noSmokingData: {
      value: "0",
      label: "Badges achieved",
      icon: IoMedalOutline,
    },
    savingsData: {
      value: "0",
      label: "Upcoming badges",
      icon: RiBookmarkLine,
    },
    healthData: {
      value: "0%",
      label: "Completion",
      icon: IoCheckmarkCircleOutline,
    },
  });

  const isLoggedIn = () => !!localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn()) {
        try {
          const [summaryRes, achievedRes, upcomingRes] = await Promise.all([
            BadgeService.getBadgeSummary(),
            BadgeService.getUserBadges(),
            BadgeService.getUpcomingBadges(),
          ]);

          const summary = summaryRes.data;

          setStatData({
            noSmokingData: {
              value: `${summary.badge_achieved_count}`,
              label: "Badges achieved",
              icon: IoMedalOutline,
            },
            savingsData: {
              value: `${summary.badge_upcoming_count}`,
              label: "Upcoming badges",
              icon: RiBookmarkLine,
            },
            healthData: {
              value: `${summary.completion_rate}%`,
              label: "Completion",
              icon: IoCheckmarkCircleOutline,
            },
          });

          setAchievedBadges(achievedRes.data.badges || []);
          setUpcomingBadges(upcomingRes.data.badges || []);
        } catch (err) {
          console.error("Failed to load badges (logged in)", err);
        }
      } else {
        try {
          const res = await BadgeService.getAllBadges();
          setAchievedBadges(res.data.badges || []);
        } catch (err) {
          console.error("Failed to load public badges", err);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="achievement-page">
      <section className="achievement-hero">
        <h1>Achievement badges</h1>
        <p>
          Celebrate each smoke-free milestone and keep track of the next badge
          waiting on your journey.
        </p>
      </section>

      <div className="achievement-stats">
        <StatCards
          noSmokingData={statData.noSmokingData}
          savingsData={statData.savingsData}
          healthData={statData.healthData}
        />
      </div>

      {isLoggedIn() ? (
        <div className="achievement-sections">
          <section className="achievement-panel">
            <div className="achievement-panel__header">
              <div>
                <span className="achievement-panel__label">Unlocked</span>
                <h2>Badges achieved</h2>
              </div>
              <p>{achievedBadges.length} collected</p>
            </div>

            <div className="achievement-grid">
              {achievedBadges.map((badge) => (
                <BadgeCard
                  key={badge._id}
                  icon={<IoMedalOutline />}
                  title={badge.name}
                  description={badge.description}
                  rarity={badge.type}
                  achievedDate={
                    badge.granted_date
                      ? new Date(badge.granted_date).toLocaleDateString(
                          "en-US",
                          {
                            timeZone: "UTC",
                          },
                        )
                      : ""
                  }
                />
              ))}
            </div>
          </section>

          <section className="achievement-panel achievement-panel--upcoming">
            <div className="achievement-panel__header">
              <div>
                <span className="achievement-panel__label">Next goals</span>
                <h2>Upcoming badges</h2>
              </div>
              <p>{upcomingBadges.length} in progress</p>
            </div>

            <div className="achievement-grid">
              {upcomingBadges.map((badge) => (
                <UpcomingBade
                  key={badge._id}
                  icon={<IoStar />}
                  title={badge.name}
                  description={badge.description}
                  rarity={badge.type}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="achievement-panel">
          <div className="achievement-panel__header">
            <div>
              <h2>All available badges</h2>
            </div>
            <p>Sign in to track progress</p>
          </div>

          <div className="achievement-grid">
            {achievedBadges.map((badge) => (
              <BadgeCard
                key={badge._id}
                icon={<IoMedalOutline />}
                title={badge.name}
                description={badge.description}
                rarity={badge.type}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AchievementPage;
