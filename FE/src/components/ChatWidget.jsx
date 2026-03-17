import React, { useState, useEffect, useRef } from "react";
import {
  VideoCameraOutlined,
  CloseOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CommunityPage from "../pages/CommunityPage/CommunityPage";
import { ChatService } from "../services/chat.service";
import { UserService } from "../services/user.service";
import { CoachUserService } from "../services/coachuser.service";
import { io } from "socket.io-client";
import { Button, Modal } from "antd";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [coachName, setCoachName] = useState("Coach");
  const [coachId, setCoachId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isProUser, setIsProUser] = useState(true);
  const [coachSessionId, setCoachSessionId] = useState(null);
  const [socket, setSocket] = useState(null);
  const [latestQuitPlan, setLatestQuitPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [role, setRole] = useState(null);
  const [chatDisabledReason, setChatDisabledReason] = useState("");
  const coachSocketRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.id;
    const userRole = decoded.role;
    setCurrentUserId(userId);
    setRole(userRole);

    if (userRole === "admin" || userRole === "coach") return;

    const setupCoach = async () => {
      try {
        const res = await ChatService.getOrCreateSession();
        const session = res?.data?.data;
        if (!session?._id) return;
        setCoachId(session.coach_id?._id);
        setCoachName(session.coach_id?.full_name + " (Coach)");
        setCoachSessionId(session._id);

        const socketRef = io(`${import.meta.env.VITE_SOCKET_URL}/coach`, {
          auth: { token },
        });
        coachSocketRef.current = socketRef;

        socketRef.on("connect", () => {
          socketRef.emit("joinSession", session._id);
        });

        setSocket(socketRef);
      } catch (_) {
        setChatDisabledReason(
          "Bạn cần nâng cấp lên gói PRO để sử dụng tính năng chat với coach."
        );
      }
    };

    const checkProStatus = async () => {
      try {
        const res = await UserService.getUserMembership(userId);
        const pkg = res?.data?.package_id?.name;
        setIsProUser(pkg === "pro");
      } catch (_) {
        setIsProUser(false);
      }
    };

    const fetchQuitPlan = async () => {
      try {
        const res = await CoachUserService.getByUserId(userId);
        const plans = res?.data?.quitPlans || [];
        if (plans.length > 0) {
          setLatestQuitPlan(plans[plans.length - 1]);
        }
      } catch (_) {}
    };

    setupCoach();
    checkProStatus();
    fetchQuitPlan();

    return () => {
      if (coachSocketRef.current) {
        coachSocketRef.current.disconnect();
      }
    };
  }, []);

  // Chờ role load xong mới render
  if (role === null) return null;
  if (role === "admin" || role === "coach") return null;

  const handleVideoCall = () => {
    if (!coachId || !currentUserId || !coachSessionId || !socket) return;
    const link = `${window.location.origin}/call/${currentUserId}-${coachId}`;
    socket.emit("sendMessage", {
      sessionId: coachSessionId,
      content: link,
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        left: "auto",
        zIndex: 9999,
      }}
    >
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "#A86523",
            color: "#fff",
            padding: "12px",
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <MessageOutlined style={{ fontSize: "20px" }} />
        </button>
      ) : (
        <div
          style={{
            width: "400px",
            height: "500px",
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: 0,
          }}
        >
          <div
            style={{
              background: "#A86523",
              color: "white",
              padding: "10px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div
              onClick={() => coachId && navigate(`/profile-coach/${coachId}`)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                cursor: "pointer",
              }}
              title="Xem hồ sơ coach"
            >
              <strong>{coachName}</strong>

              {latestQuitPlan && (
                <span style={{ fontSize: "12px", color: "#fefefe" }}>
                  Đang theo:{" "}
                  <strong>
                    {latestQuitPlan.goal.replace("_", " ").toUpperCase()}
                  </strong>
                  <Button
                    type="link"
                    size="small"
                    style={{ color: "#d1e3ff", padding: 0, marginLeft: 4 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPlanModal(true);
                    }}
                  >
                    (chi tiết)
                  </Button>
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {!chatDisabledReason && (
                <VideoCameraOutlined
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVideoCall();
                  }}
                  style={{ fontSize: "18px", cursor: "pointer" }}
                  title="Meet"
                />
              )}
              <CloseOutlined
                onClick={() => setOpen(false)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflow: "hidden" }}>
            {chatDisabledReason ? (
              <div
                style={{ padding: "16px", textAlign: "center", color: "gray" }}
              >
                <p>{chatDisabledReason}</p>
              </div>
            ) : (
              <CommunityPage
                isWidget={true}
                externalSocket={socket}
                externalSessionId={coachSessionId}
                externalUserId={currentUserId}
              />
            )}
          </div>
        </div>
      )}

      <Modal
        open={showPlanModal}
        onCancel={() => setShowPlanModal(false)}
        footer={null}
        title="Chi tiết Quit Plan"
        width={600}
      >
        {latestQuitPlan ? (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-blue-700">
              {latestQuitPlan.goal.replace("_", " ").toUpperCase()}
            </h3>
            <p className="text-sm text-gray-500">
              <strong>Start:</strong>{" "}
              {new Date(latestQuitPlan.start_date).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <strong>Lý do:</strong>{" "}
              {latestQuitPlan.reasons?.join(", ") || "Không có"}
            </p>
            <div className="space-y-2 mt-4">
              <h4 className="font-semibold">Các Giai đoạn:</h4>
              {latestQuitPlan.stages?.map((stage) => (
                <div
                  key={stage._id}
                  className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded"
                >
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-800">{stage.name}</p>
                    <span className="text-xs text-gray-500">
                      {stage.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {stage.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(stage.start_date).toLocaleDateString()} →{" "}
                    {new Date(stage.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Không có kế hoạch nào được tìm thấy.</p>
        )}
      </Modal>
    </div>
  );
};

export default ChatWidget;
