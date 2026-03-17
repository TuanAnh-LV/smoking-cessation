import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/auth.service";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying your email...");
  const hasRun = useRef(false);

  const getStatusIcon = () => {
    const s = status.toLowerCase();
    if (s.includes("verifying"))
      return <LoadingOutlined spin style={iconStyle("#1890ff")} />;
    if (s.includes("success") || s.includes("already"))
      return <CheckCircleOutlined style={iconStyle("#52c41a")} />;
    if (s.includes("invalid") || s.includes("expired") || s.includes("fail"))
      return <CloseCircleOutlined style={iconStyle("#f5222d")} />;
    return <LoadingOutlined spin style={iconStyle("#1890ff")} />;
  };

  const iconStyle = (color) => ({
    fontSize: 50,
    color,
    marginBottom: "1rem",
  });

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("No token was provided.");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const verifyEmail = async () => {
      try {
        const res = await AuthService.verifyEmail(token);
        const message = res?.message?.toLowerCase?.() || "";

        if (message.includes("verified")) {
          setStatus("Email verified successfully. Redirecting to login...");
        } else if (message.includes("already")) {
          setStatus("Your email has already been verified. Redirecting...");
        } else {
          setStatus(res.message || "Verification completed.");
        }

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } catch (err) {
        const errorMsg =
          err?.response?.data?.error ||
          err?.message ||
          "Email verification failed.";

        const msg = errorMsg.toLowerCase();
        if (msg.includes("expired") || msg.includes("invalid")) {
          setStatus("The verification link is invalid or has expired.");
        } else if (msg.includes("already")) {
          setStatus("Your email has already been verified.");
          setTimeout(() => {
            navigate("/login", { replace: true });
          }, 3000);
        } else {
          setStatus(errorMsg);
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div style={containerStyle}>
      {getStatusIcon()}
      <h2 style={titleStyle}>Email Verification</h2>
      <p style={statusTextStyle}>{status}</p>
    </div>
  );
}

const containerStyle = {
  maxWidth: 500,
  margin: "5rem auto",
  padding: "3rem 2rem",
  textAlign: "center",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const titleStyle = {
  fontSize: "1.8rem",
  marginBottom: "0.5rem",
  color: "#333",
};

const statusTextStyle = {
  fontSize: "1.1rem",
  color: "#666",
};

export default VerifyEmailPage;
