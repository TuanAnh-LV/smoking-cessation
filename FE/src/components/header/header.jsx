import React, { useState, useEffect, useRef } from "react";
import "./header.scss";
import LogoBlack from "../../assets/LogoBlack.png";
import { Link, useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useAuth } from "../../context/authContext";
import { message } from "antd";
import { SmokingStatusService } from "../../services/smokingStatus.service";
import NotificationDropdown from "../NotificationSettings/NotificationDropdown";
import { NotificationService } from "../../services/notification.service";
const Header = () => {
  const navigate = useNavigate();
  const {
    token,
    logout,
    role,
    userInfo,
    notifications,
    setNotifications,
    unreadCount,
    setUnreadCount,
  } = useAuth();

  const isLoggedIn = !!token;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [planId, setPlanId] = useState(localStorage.getItem("currentPlanId"));

  const [showDropdown, setShowDropdown] = useState(false);

  const profileRef = useRef();
  const dropdownRef = useRef();
  const profileDropdownRef = useRef();
  useEffect(() => {
    if (!isLoggedIn || !userInfo?._id) return;

    NotificationService.getAll().then((res) => {
      const data = res.data;
      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      } else {
        console.warn("Không phải mảng:", data);
        setNotifications([]);
      }
    });
  }, [isLoggedIn, userInfo?._id]);

  useEffect(() => {
    const checkPlanIdChange = () => {
      const stored = localStorage.getItem("currentPlanId");
      setPlanId((prev) => (prev !== stored ? stored : prev));
    };

    const interval = setInterval(checkPlanIdChange, 1000); // kiểm tra mỗi giây

    return () => clearInterval(interval);
  }, []);

  const handleToggleDropdown = () => setShowDropdown(!showDropdown);

  const handleClearNotifications = async () => {
    try {
      await NotificationService.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Xóa tất thất bại:", err);
    }
  };

  const handleNotificationClick = async (noti) => {
    if (!noti.is_read) {
      await NotificationService.markAsRead(noti._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === noti._id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleQuitPlanClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      const res = await SmokingStatusService.getLatestPrePlanStatus();
      const data = res.data;

      if (data?.plan_id === null) {
        navigate("/quit-plan"); // Đã có status nhưng chưa có plan → tạo kế hoạch
      } else {
        navigate("/status"); // Chưa có gì hoặc lỗi → cho vào status
      }
    } catch (err) {
      console.error("Error checking pre-plan status:", err);
      navigate("/status");
    }
  };

  const handleLogout = () => {
    logout();
    message.success("Logout successful!");
    navigate("/login");
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="header">
      <img src={LogoBlack} alt="Quit Smoking Logo" className="logo" />

      <div
        className="hamburger-menu-icon"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <HiOutlineMenuAlt3 className="icon" />
      </div>

      <div className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <Link to="/">
          <p>Home</p>
        </Link>
        <Link to="/achievements">
          <p>Achievements</p>
        </Link>
        {isLoggedIn && planId && (
          <>
            <Link to={planId ? `/progress/${planId}` : "/status"}>
              Track Progress
            </Link>
          </>
        )}

        {!planId && (
          <p onClick={handleQuitPlanClick} style={{ cursor: "pointer" }}>
            Quit Plan
          </p>
        )}

        <Link to="/blogs">
          <p>Blogs</p>
        </Link>
      </div>

      {isLoggedIn ? (
        <div className="logged-in-icons" ref={profileRef}>
          <div className="relative" ref={dropdownRef}>
            <button
              className="notification-button"
              onClick={handleToggleDropdown}
            >
              <IoMdNotificationsOutline className="icon" />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showDropdown && (
              <NotificationDropdown
                notifications={notifications}
                onClear={handleClearNotifications}
                onClickItem={handleNotificationClick}
                setNotifications={setNotifications}
                setUnreadCount={setUnreadCount}
              />
            )}
          </div>

          <div className="relative" ref={profileDropdownRef}>
            <FaRegUserCircle
              className="icon cursor-pointer text-xl hover:text-black transition"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            />
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50 p-2 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Profile
                </Link>
                {role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {role === "coach" && (
                  <Link
                    to="/coach"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Coach Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="logout-button">
            <FiLogOut className="icon" />
            <span>Logout</span>
          </button>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login">
            <button className="login">Login</button>
          </Link>
          <Link to="/register">
            <button className="register">Register</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;
