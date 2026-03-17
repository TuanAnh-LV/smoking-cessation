import React, { useEffect, useRef, useState } from "react";
import { Typography, Input, Button, Avatar } from "antd";
import { SendOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import { CommunityService } from "../../services/community.service";
import "./CommunityChat.scss";

const { Text } = Typography;
const { TextArea } = Input;

const CommunityChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("userInfo");
    const user = userStr ? JSON.parse(userStr) : null;
    setCurrentUserId(user?._id);

    if (!token) return;

    const communitySocket = io(`${import.meta.env.VITE_SOCKET_URL}/community`, {
      auth: { token },
    });
    setSocket(communitySocket);

    CommunityService.getMessages()
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : res;
        setMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => setMessages([]));

    communitySocket.on("chat message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      communitySocket.disconnect();
    };
  }, []);

  useEffect(() => {
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    socket.emit("chat message", { message: inputMessage });
    setInputMessage("");
  };

  return (
    <div className="community-chat">
      <div className="chat-title">💬 Chat Cộng đồng</div>
      <div className="chat-messages">
        {messages.map((msg, i) => {
          const author = msg.author_id || {};
          const fullName = author.full_name || "Ẩn danh";
          const initial = fullName.charAt(0).toUpperCase();
          const isOwnMessage = author._id === currentUserId;
console.log("CurrentUser:", currentUserId, "Author:", author._id);
          return (
            <div
              key={i}
              className={`chat-message ${isOwnMessage ? "own-message" : ""}`}
            >
              <Avatar size={40} className="chat-avatar">{initial}</Avatar>
              <div className="chat-bubble">
                <div className="chat-author">{fullName}</div>
                <div className="chat-content">{msg.content}</div>
                <div className="chat-time">
                  <ClockCircleOutlined style={{ fontSize: 12, marginRight: 4 }} />
                  {dayjs(msg.sent_at || msg.timestamp).format("HH:mm")}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <TextArea
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onPressEnter={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          placeholder="Nhập tin nhắn..."
        />
        <Button type="primary" icon={<SendOutlined />} onClick={sendMessage}>
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default CommunityChat;
