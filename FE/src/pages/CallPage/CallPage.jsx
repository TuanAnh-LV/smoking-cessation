import React, { useEffect, useState } from "react";
import {
  StreamVideo,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import axios from "axios";
import { useParams } from "react-router-dom"; // Sử dụng useParams để lấy callId từ URL
import { StreamVideoClient } from "@stream-io/video-react-sdk";

const CallPage = () => {
  const { id } = useParams(); // Lấy callId từ URL
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupCall = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Không tìm thấy token");

        // Giải mã token và lấy thông tin người dùng
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const full_name = decoded.full_name || "User";
        const userIdFromToken = decoded.id;

        if (!userIdFromToken)
          throw new Error("Không tìm thấy userId trong token");

        const res = await axios.get(
          `${import.meta.env.VITE_SOCKET_URL}/api/video/token`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Khởi tạo StreamVideoClient với userId từ token
        const streamClient = new StreamVideoClient({
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          user: { id: userIdFromToken, name: full_name }, // Sử dụng userId từ token
          token: res.data.token,
        });

        // Tạo cuộc gọi video với callId duy nhất từ URL
        const callInstance = streamClient.call("default", id);
        await callInstance.getOrCreate(); // Tạo cuộc gọi nếu chưa tồn tại
        await callInstance.join(); // Tham gia vào cuộc gọi

        setClient(streamClient);
        setCall(callInstance);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi kết nối video call:", err);
        setLoading(false);
      }
    };

    setupCall();

    return () => {
      call?.leave?.();
      client?.disconnectUser?.();
    };
  }, [id]); // Chạy lại khi callId (id) thay đổi

  if (loading)
    return <div style={{ padding: "1rem" }}>🔄 Đang kết nối cuộc gọi...</div>;
  if (!client || !call) return <div>Không thể thiết lập cuộc gọi.</div>;

  return (
    <StreamTheme>
      <StreamVideo>
        <StreamCall call={call}>
          <SpeakerLayout />
          <CallControls />
        </StreamCall>
      </StreamVideo>
    </StreamTheme>
  );
};

export default CallPage;
