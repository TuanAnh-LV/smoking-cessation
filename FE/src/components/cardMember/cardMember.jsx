import React, { useEffect, useMemo, useState } from "react";
import "./cardMember.scss";
import { useNavigate } from "react-router-dom";
import { MembershipService } from "../../services/membership.service";
import { UserMembershipService } from "../../services/userMembership.service";
import { useAuth } from "../../context/authContext";

const CardMemberSection = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [membership, setMembership] = useState([]);
  const [currentMembershipId, setCurrentMembershipId] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [upgradeCosts, setUpgradeCosts] = useState({});

  useEffect(() => {
    MembershipService.getAllMemberships()
      .then((res) => {
        const data = Array.isArray(res) ? res : res.data || [];
        setMembership(data);
      })
      .catch((err) => {
        console.error("Failed to fetch memberships:", err);
      });
  }, []);

  useEffect(() => {
    if (!token) {
      setCurrentMembershipId("");
      setCurrentPrice(0);
      return;
    }

    UserMembershipService.getCurrentUserMembership()
      .then((res) => {
        const data = res.data;
        if (data?.package_id?._id) {
          setCurrentMembershipId(data.package_id._id);
          setCurrentPrice(data.package_id.price || 0);
        } else {
          setCurrentMembershipId("");
          setCurrentPrice(0);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch current membership:", err);
      });
  }, [token]);

  useEffect(() => {
    if (!token || !currentMembershipId || membership.length === 0) return;

    const fetchUpgradeCosts = async () => {
      const results = {};
      for (const item of membership) {
        if (
          String(item._id) !== String(currentMembershipId) &&
          item.price > currentPrice
        ) {
          try {
            const res = await UserMembershipService.previewUpgrade(item._id);
            results[item._id] = res.data?.upgradeCost || item.price;
          } catch (err) {
            results[item._id] = item.price;
          }
        }
      }
      setUpgradeCosts(results);
    };

    fetchUpgradeCosts();
  }, [membership, currentMembershipId, currentPrice, token]);

  const visibleMemberships = useMemo(() => {
    return membership.filter((item) => {
      if (currentPrice > 0 && item.price === 0) return false;
      return true;
    });
  }, [membership, currentPrice]);

  const highestPriceId = useMemo(() => {
    const paidPlans = visibleMemberships.filter((item) => item.price > 0);
    if (paidPlans.length === 0) return "";

    return paidPlans.reduce((highest, item) =>
      item.price > highest.price ? item : highest
    )._id;
  }, [visibleMemberships]);

  const handleUpgrade = (item) => {
    if (!token) {
      navigate("/login");
      return;
    }

    navigate("/payment", {
      state: {
        _id: item._id,
        title: item.name,
        price: upgradeCosts[item._id] || item.price,
        desc: item.description,
        date: new Date().toLocaleDateString("vi-VN"),
      },
    });
  };

  return (
    <section className="card-member-section">
      <div className="container">
        <div className="section-heading">
          <h2>Choose a Membership Plan</h2>
          <p>
            Start free, upgrade when you need more reminders, personal coaching
            and premium support on your quit journey.
          </p>
        </div>

        <div className="cards-container">
          {visibleMemberships.map((item) => {
            const isCurrent = String(item._id) === String(currentMembershipId);
            const isDowngrade = item.price < currentPrice;
            const isFeatured =
              String(item._id) === String(highestPriceId) &&
              visibleMemberships.length > 1;
            const disabled = Boolean(token) && (isCurrent || isDowngrade);
            const upgradePrice = upgradeCosts[item._id];
            const displayPrice = upgradePrice || item.price;
            const showDiscount = upgradePrice && upgradePrice !== item.price;
            const actionLabel = !token
              ? "Select Plan"
              : isCurrent
              ? "Current Plan"
              : item.price === 0
              ? "Free Plan"
              : "Upgrade";

            return (
              <article
                key={item._id}
                className={`member-card ${isFeatured ? "featured" : ""} ${
                  isCurrent ? "current" : ""
                }`}
              >
                <div className="card-top">
                  <div className="plan-meta">
                    <span className="plan-name">{item.name || "Membership"}</span>
                    {isFeatured && <span className="plan-badge">Recommended</span>}
                    {isCurrent && <span className="plan-badge muted">Active</span>}
                  </div>

                  <div className={`package-price ${item.price === 0 ? "free" : ""}`}>
                    <strong>{displayPrice.toLocaleString()} VND</strong>
                    {showDiscount && (
                      <span className="original-price">
                        <s>{item.price.toLocaleString()} VND</s>
                      </span>
                    )}
                  </div>
                </div>

                <p className="package-description">{item.description}</p>

                <ul className="package-features">
                  <li className="enabled">Access to quit plans</li>
                  <li className={item.can_use_reminder ? "enabled" : "muted"}>
                    Daily reminders
                  </li>
                  <li className={item.can_assign_coach ? "enabled" : "muted"}>
                    Assign personal coach
                  </li>
                  <li
                    className={
                      item.can_earn_special_badges ? "enabled" : "muted"
                    }
                  >
                    Special badges
                  </li>
                </ul>

                <button
                  className={`package-button ${isFeatured ? "primary" : ""}`}
                  disabled={disabled}
                  onClick={(e) => {
                    if (disabled) {
                      e.preventDefault();
                      return;
                    }
                    handleUpgrade(item);
                  }}
                >
                  {actionLabel}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CardMemberSection;
