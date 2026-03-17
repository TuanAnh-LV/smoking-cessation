// src/pages/CommunityPage/CommunityPage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Input,
  Button,
  Avatar,
  Badge,
  Spin,
} from "antd";
import {
  SendOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import { ChatService } from "../../services/chat.service";
import { UserService } from "../../services/user.service";

const { Text } = Typography;
const { TextArea } = Input;

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 60%, 70%)`;
}

const CommunityPage = ({
  isWidget = false,
  isCoachView = false,
  externalSocket = null,
  externalSessionId = null,
  externalUserId = null,
}) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [coachSessionId, setCoachSessionId] = useState(null);
  const [coachName, setCoachName] = useState("Coach");
  const [coachId, setCoachId] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const coachSocketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const userId = decoded.id;
    setCurrentUserId(externalUserId || userId);

    const setupUserSession = async () => {
      try {
        const res = await ChatService.getOrCreateSession();
        const session = res?.data?.data;
        if (!session?._id) return;
        setCoachSessionId(session._id);
        setCoachId(session.coach_id?._id);
        setCoachName(session.coach_id?.full_name + " (Coach)");

        const msgRes = await ChatService.getMessages(session._id);
        setMessages(msgRes?.data?.data || []);

        const socketRef = io(`${import.meta.env.VITE_SOCKET_URL}/coach`, {
          auth: { token },
        });
        coachSocketRef.current = socketRef;

        socketRef.on("connect", () => {
          socketRef.emit("joinSession", session._id);
        });

        socketRef.on("newMessage", (msg) => {
          setMessages((prev) => {
            if (prev.some((m) => (m._id || m.id) === (msg._id || msg.id))) return prev;
            return [...prev, msg];
          });
        });

        setSocket(socketRef);
      } catch (err) {
        console.error("Lỗi tạo session user:", err);
      }
    };

    const setupCoachView = async () => {
      try {
        const res = await ChatService.getSessionByCoach();
        setChatList(res?.data?.data || []);
        if (res?.data?.data?.length > 0) {
          handleSelectChat(res.data.data[0]);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách coach chat:", err);
      }
    };

    if (isCoachView) {
      setupCoachView();
    } else {
      setupUserSession();
    }

    return () => {
      if (!externalSocket && coachSocketRef.current) {
        coachSocketRef.current.disconnect();
      }
    };
  }, [isCoachView]);

  const handleSelectChat = async (session) => {
    setSelectedChat(session);
    setCoachSessionId(session._id);
    setCoachId(session.coach_id?._id);
    setCoachName(session.user_id?.full_name || "User");
    const msgRes = await ChatService.getMessages(session._id);
    setMessages(msgRes?.data?.data || []);
    if (socket) socket.emit("joinSession", session._id);
  };

  const sendMessage = () => {
    if (!input.trim() || !coachSessionId || !socket) return;
    socket.emit("sendMessage", {
      sessionId: coachSessionId,
      content: input,
    });
    setInput("");
  };

  return (
    <div className="flex h-full w-full">
      {isCoachView && (
        <div className="w-72 bg-white border-r overflow-y-auto p-4">
          <h3 className="font-bold text-lg mb-3">Khách hàng đang chat</h3>
          {chatList.map((item) => (
            <div
              key={item._id}
              onClick={() => handleSelectChat(item)}
              className={`cursor-pointer p-2 rounded hover:bg-gray-100 mb-1 ${
                selectedChat?._id === item._id ? "bg-blue-50" : ""
              }`}
            >
              <div className="font-medium">{item.user_id?.full_name}</div>
              <div className="text-sm text-gray-500">{item.user_id?.email}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col h-full">
        {!isWidget && (
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <Badge>
                <Avatar
                  style={{ backgroundColor: stringToColor(coachName) }}
                >
                  {coachName.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <span className="font-semibold text-sm">{coachName}</span>
            </div>
            <Button
              icon={<VideoCameraOutlined />}
              size="small"
              onClick={() => {
                if (!coachSessionId || !currentUserId || !coachId) return;
                const link = `${window.location.origin}/call/${currentUserId}-${coachId}`;
                socket.emit("sendMessage", {
                  sessionId: coachSessionId,
                  content: link,
                });
              }}
            >
              Meet
            </Button>
          </div>
        )}

        <div className="flex-grow overflow-y-auto px-2 pt-4 space-y-4">
          {messages.map((msg, index) => {
            const senderId =
              msg.user_id?._id || msg.user_id || msg.author_id?._id;
            const isOwn = String(senderId) === String(currentUserId);
            const displayName = isOwn ? "Bạn" : coachName;
            return (
              <div
                key={msg.id || msg._id || index}
                className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
              >
                <span className="text-xs text-gray-500 font-medium mb-1">
                  {displayName}
                </span>
                <div className="max-w-[70%] break-words">
                  <div
                    className={`px-4 py-2 rounded-xl whitespace-pre-wrap font-bold ${
                      isOwn ? "bg-[#A86523] text-white" : "bg-gray-100 text-black"
                    }`}
                  >
                    <Text>
                      {msg.content.startsWith("http") ? (
                        <>
                          <p>Tham gia cuộc gọi video tại:</p>
                          <a
                            href={msg.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {msg.content}
                          </a>
                        </>
                      ) : (
                        msg.content
                      )}
                    </Text>
                  </div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <ClockCircleOutlined className="text-[10px]" />
                    <span>{dayjs(msg.sent_at || msg.timestamp).format("HH:mm")}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2 mt-2 px-2 pb-2">
          <TextArea
            rows={1}
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="flex-1 rounded-lg"
          />
          <Button
            style={{ backgroundColor: "#A86523", borderColor: "#A86523" }}
            type="primary"
            icon={<SendOutlined />}
            onClick={sendMessage}
            className="rounded-lg"
          >
            Gửi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
