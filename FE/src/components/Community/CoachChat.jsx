import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ChatService } from "../../services/chat.service";
import { VideoIcon } from "lucide-react";
import "./CoachChat.scss";

const CoachChat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [coachName, setCoachName] = useState("Coach");
  const [coachId, setCoachId] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const setupChat = async () => {
      try {
        const response = await ChatService.getOrCreateSession();
        const sessionData = response?.data?.data;
        const sid = sessionData?._id;
        if (!sid) return;

        setSessionId(sid);
        setCoachId(sessionData?.coach_id?._id);
        setCoachName(sessionData?.coach_id?.full_name || "Coach");

        const msgRes = await ChatService.getMessages(sid);
        setMessages(msgRes?.data?.data || []);

        socketRef.current = io(`${import.meta.env.VITE_SOCKET_URL}/coach`, {
          auth: { token },
        });

        socketRef.current.on("connect", () => {
          socketRef.current.emit("joinSession", sid);
        });

        socketRef.current.on("newMessage", (msg) => {
          setMessages((prev) => [...prev, msg]);
        });
      } catch (err) {
        console.error("Lỗi setup chat:", err);
      }
    };

    setupChat();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !sessionId) return;
    socketRef.current.emit("sendMessage", { sessionId, content: input });
    setInput("");
  };

  const handleVideoCall = () => {
    if (!sessionId || !userId || !coachId) return;

    const callLink = `${window.location.origin}/call/${userId}-${coachId}`;
    socketRef.current.emit("sendMessage", {
      sessionId,
      content: `Hãy tham gia cuộc gọi video chung tại: ${callLink}`,
    });
  };

  const getAvatarText = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 0) return "??";
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div className="community-page">
      <div className="coach-chat-wrapper">
        <div className="community-chat">
          {/* Header hiển thị tên coach */}
          <div className="community-chat__header">
            <span>
              Đang trò chuyện với <strong>{coachName}</strong>
            </span>
            <button
              onClick={handleVideoCall}
              className="community-chat__video-btn"
            >
              <VideoIcon className="video-icon" />
              Gửi link video
            </button>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="community-chat__messages">
            {messages.map((msg, idx) => {
              const senderId =
                msg.user_id?._id || msg.user_id || msg.author?._id;
              const senderName =
                msg.author?.full_name || msg.user_id?.full_name || "Coach";
              const isOwn = String(senderId) === String(userId);
              const avatar = getAvatarText(senderName);

              return (
                <div
                  key={idx}
                  className={`chat-message ${isOwn ? "chat-message--own" : ""}`}
                >
                  <span className="chat-message__avatar">{avatar}</span>
                  <div className="chat-message__content">
                    <span className="chat-message__author">{senderName}</span>
                    {msg.content.includes("call/") ? (
                      <a
                        href={msg.content.split("tại: ")[1]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline break-all"
                      >
                        {msg.content.split("tại: ")[1]}
                      </a>
                    ) : (
                      <div>{msg.content}</div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input gửi tin nhắn */}
          <div className="community-chat__input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Nhắn gì đó..."
            />
            <button className="community-chat__send-btn" onClick={sendMessage}>
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachChat;
