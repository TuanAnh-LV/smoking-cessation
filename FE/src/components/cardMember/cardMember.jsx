import React, { useEffect, useState } from "react";
import "./cardMember.scss";
import { useNavigate } from "react-router-dom";

import { MembershipService } from "../../services/membership.service";
import { UserMembershipService } from "../../services/userMembership.service";

const CardMemberSection = () => {
  const navigate = useNavigate();
  const [membership, setMembership] = useState([]);
  const [currentMembershipId, setCurrentMembershipId] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [upgradeCosts, setUpgradeCosts] = useState({});

  // Fetch memberships and user's current membership
  useEffect(() => {
    MembershipService.getAllMemberships()
      .then((res) => {
        const data = Array.isArray(res) ? res : res.data || [];
        setMembership(data);
      })
      .catch((err) => {
        console.error("Failed to fetch memberships:", err);
      });

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
  }, []);

  // Preview upgrade costs
  useEffect(() => {
    if (!currentMembershipId || membership.length === 0) return;

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
  }, [membership, currentMembershipId]);

  const handleUpgrade = (item) => {
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
    <div className="card-member-section">
      <div className="container">
        <h2>Choose a Membership Plan</h2>
        <div className="cards-container">
          {membership
            .filter((item) => {
              // Ẩn gói miễn phí nếu người dùng đang dùng gói trả phí
              if (currentPrice > 0 && item.price === 0) return false;
              return true;
            })
            .map((item) => {
              const isCurrent =
                String(item._id) === String(currentMembershipId);
              const isDowngrade = item.price < currentPrice;
              const disabled = isCurrent || isDowngrade;
              const upgradePrice = upgradeCosts[item._id];
              const showDiscount =
                upgradePrice && upgradePrice !== item.price;

              return (
                <div key={item._id} className="member-card standard">
                  <div className="package-header">
                    <div
                      className={`package-price ${
                        item.price === 0 ? "free" : ""
                      }`}
                    >
                      {(upgradePrice || item.price).toLocaleString()} VND
                      {showDiscount && (
                        <div className="original-price">
                          <s>{item.price.toLocaleString()} VND</s>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="package-description">{item.description}</p>

                  <ul className="package-features">
                    <li>Access to quit plans</li>
                    <li
                      style={{
                        opacity: item.can_use_reminder ? 1 : 0.3,
                      }}
                    >
                      Daily reminders
                    </li>
                    <li
                      style={{
                        opacity: item.can_assign_coach ? 1 : 0.3,
                      }}
                    >
                      Assign personal coach
                    </li>
                    <li
                      style={{
                        opacity: item.can_earn_special_badges ? 1 : 0.3,
                      }}
                    >
                      Special badges
                    </li>
                  </ul>

                  <button
                    className="package-button"
                    disabled={disabled}
                    style={{
                      backgroundColor: disabled ? "#ccc" : "",
                      color: disabled ? "#888" : "#fff",
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                    onClick={(e) => {
                      if (disabled) {
                        e.preventDefault();
                        return;
                      }
                      handleUpgrade(item);
                    }}
                  >
                    {!currentMembershipId
                      ? "Select Plan"
                      : isCurrent
                      ? "Current"
                      : item.price === 0
                      ? "Free"
                      : "Upgrade"}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CardMemberSection;
