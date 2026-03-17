import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Avatar,
  Typography,
  Input,
  Button,
  List,
  Badge,
  Divider,
  message as AntMessage,
  Modal,
} from "antd";
import {
  SendOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { io } from "socket.io-client";
import { ChatService } from "../../../services/chat.service";
import { CoachUserService } from "../../../services/coachuser.service";

const { Title, Text } = Typography;
const { TextArea } = Input;

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 70%)`;
  return color;
}

const ChatMessage = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");
  const [currentCoachId, setCurrentCoachId] = useState(null);

  useEffect(() => {
    if (!token) return;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setCurrentCoachId(decoded.id);

    const socket = io(`${import.meta.env.VITE_SOCKET_URL}/coach`, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Coach] Socket connected");
      // Join tất cả sessionId để nhận tin mới realtime
      chatList.forEach((session) => {
        socket.emit("joinSession", session._id);
      });
    });

    socket.on("newMessage", (msg) => {
      // Cập nhật preview ở sidebar
      setChatList((prev) =>
        prev.map((chat) =>
          chat._id === msg.session_id
            ? { ...chat, lastMessage: msg.content, lastUpdated: new Date() }
            : chat
        )
      );

      // Nếu đang mở chat này thì thêm vào
      if (selectedChat && msg.session_id === selectedChat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.disconnect();
  }, [chatList, selectedChat]);

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const fetchChatSessions = async () => {
    try {
      const res = await ChatService.getSessionByCoach();
      setChatList(res?.data?.data || []);
      if (res?.data?.data?.length > 0) selectChat(res.data.data[0]);
    } catch (err) {
      AntMessage.error("Không thể tải danh sách phiên chat");
    }
  };

  const selectChat = async (session) => {
    setSelectedChat(session);
    try {
      const res = await ChatService.getMessages(session._id);
      setMessages(res?.data?.data || []);
      socketRef.current.emit("joinSession", session._id);

      const relationRes = await CoachUserService.getByUserId(
        session.user_id._id
      );
      const quitPlans = relationRes?.data?.quitPlans || [];
      const latestQuitPlan = quitPlans[quitPlans.length - 1] || null;
      setSelectedChat((prev) => ({ ...prev, latestQuitPlan }));
    } catch (err) {
      AntMessage.error("Không thể tải tin nhắn hoặc quit plan");
    }
  };

  const handleSend = () => {
    if (!input.trim() || !selectedChat) return;
    socketRef.current.emit("sendMessage", {
      sessionId: selectedChat._id,
      content: input,
    });
    setInput("");
  };

  const handleVideoCall = () => {
    const origin = window.location.origin;
    const callLink = `${origin}/call/${selectedChat?.user_id?._id}-${currentCoachId}`;
    socketRef.current.emit("sendMessage", {
      sessionId: selectedChat._id,
      content: callLink,
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r overflow-y-auto p-4">
        <Title level={4}>Trò chuyện</Title>
        <Divider />
        <List
          itemLayout="horizontal"
          dataSource={chatList}
          renderItem={(item) => (
            <List.Item
              className={`cursor-pointer rounded-lg px-2 py-2 ${
                selectedChat?._id === item._id ? "bg-blue-100" : ""
              }`}
              onClick={() => selectChat(item)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: stringToColor(item.user_id.full_name),
                    }}
                  >
                    {item.user_id.full_name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <Text className="font-medium">{item.user_id.full_name}</Text>
                }
                description={<Text type="secondary">{item.user_id.email}</Text>}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-gray-50 p-6 overflow-hidden flex flex-col">
        {selectedChat && (
          <Card
            className="h-full shadow-md rounded-2xl flex flex-col"
            bodyStyle={{
              padding: "1.5rem",
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge>
                    <Avatar
                      size={48}
                      style={{
                        backgroundColor: stringToColor(
                          selectedChat.user_id.full_name
                        ),
                      }}
                    >
                      {selectedChat.user_id.full_name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                  <div>
                    <Title level={5} className="mb-0">
                      {selectedChat.user_id.full_name}
                    </Title>
                    {selectedChat.latestQuitPlan && (
                      <Button
                        type="link"
                        size="small"
                        className="p-0 text-blue-600 underline"
                        onClick={() => setShowPlanModal(true)}
                      >
                        Xem Quit Plan
                      </Button>
                    )}
                  </div>
                </div>
                <Button
                  icon={<VideoCameraOutlined />}
                  onClick={handleVideoCall}
                  className="rounded-xl"
                >
                  Meet
                </Button>
              </div>
            }
          >
            {/* Vùng tin nhắn */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
              {messages.map((msg) => {
                const isMe =
                  msg.user_id === currentCoachId ||
                  msg.user_id?._id === currentCoachId;
                const displayName = isMe
                  ? "Bạn"
                  : selectedChat.user_id.full_name;
                return (
                  <div
                    key={msg._id || msg.id}
                    className={`flex flex-col ${
                      isMe ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-xs text-gray-500 font-medium mb-1">
                      {displayName}
                    </span>
                    <div className="max-w-[70%] break-words">
                      <div
                        className={`px-4 py-2 rounded-xl whitespace-pre-wrap break-words ${
                          isMe
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-black"
                        }`}
                      >
                        <Text>
                          {msg.content.startsWith("http") ? (
                            <>
                              Hãy tham gia cuộc gọi video tại:{" "}
                              <a
                                href={msg.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: isMe ? "white" : "#1d4ed8",
                                  textDecoration: "underline",
                                }}
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
                        <span>
                          {dayjs(msg.sent_at || msg.timestamp).format("HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nhập tin nhắn */}
            <div
              className="flex items-center gap-2 mt-2"
              style={{ flexShrink: 0 }}
            >
              <TextArea
                rows={1}
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex-1 rounded-lg"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                className="rounded-lg"
              >
                Gửi
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* ✅ Modal hiển thị quit plan */}
      <Modal
        open={showPlanModal}
        onCancel={() => setShowPlanModal(false)}
        footer={null}
        title="Chi tiết Quit Plan"
        width={600}
      >
        {selectedChat?.latestQuitPlan ? (
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-blue-700">
              {selectedChat.latestQuitPlan.goal.replace("_", " ").toUpperCase()}
            </h3>
            <p className="text-sm text-gray-500">
              <strong>Start:</strong>{" "}
              {new Date(
                selectedChat.latestQuitPlan.start_date
              ).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <strong>Lý do:</strong>{" "}
              {selectedChat.latestQuitPlan.reasons?.join(", ") || "Không có"}
            </p>

            <div className="space-y-2">
              <h4 className="font-semibold">Các Giai đoạn:</h4>
              {selectedChat.latestQuitPlan.stages?.map((stage) => (
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
                  <p className="text-xs text-gray-400">
                    {new Date(stage.start_date).toLocaleDateString()} →{" "}
                    {new Date(stage.end_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Không có dữ liệu Quit Plan.</p>
        )}
      </Modal>
    </div>
  );
};

export default ChatMessage;
