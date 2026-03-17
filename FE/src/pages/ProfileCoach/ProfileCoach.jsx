  import React, { useEffect, useState } from "react";
  import "./ProfileCoach.scss";
  import { useParams } from "react-router-dom";
  import { UserService } from "../../services/user.service";
  import { FeedbackService } from "../../services/feedback.service";
  import { Avatar, List, Rate, Spin, Typography, Input, Button, message, Card, Divider } from "antd";

  const { Title, Text, Paragraph } = Typography;

  const ProfileCoach = () => {
    const { id } = useParams();
    const [coach, setCoach] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [myRating, setMyRating] = useState(5);
    const [myComment, setMyComment] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
      setLoading(true);
      Promise.all([
        UserService.getUserById(id),
        FeedbackService.getFeedbacksByCoach(id),
      ])
        .then(([coachRes, feedbackRes]) => {
          setCoach(coachRes.data);
          setFeedbacks(Array.isArray(feedbackRes.data) ? feedbackRes.data : []);
        })
        .catch(() => message.error("Không thể tải thông tin coach hoặc feedback!"))
        .finally(() => setLoading(false));
    }, [id]);

    const validFeedbacks = feedbacks.filter(fb => typeof fb.rating === "number" && !isNaN(fb.rating));
    const avgRating = validFeedbacks.length
      ? validFeedbacks.reduce((a, b) => a + b.rating, 0) / validFeedbacks.length
      : 0;

    const handleSendFeedback = async () => {
      if (!myComment.trim()) {
        message.warning("Vui lòng nhập nội dung đánh giá!");
        return;
      }
      setSending(true);
      try {
        await FeedbackService.createFeedbackCoach({
          coach_user_id: id,
          rating: myRating,
          comment: myComment,
        });
        setMyComment("");
        setMyRating(5);
        message.success("Gửi đánh giá thành công!");
        FeedbackService.getFeedbacksByCoach(id).then(res => {
          setFeedbacks(Array.isArray(res.data) ? res.data : []);
        });
      } catch (err) {
        message.error("Gửi đánh giá thất bại!");
      } finally {
        setSending(false);
      }
    };

    if (loading) return <Spin style={{ display: "block", margin: "auto", marginTop: 80 }} />;

    if (!coach) return <div>Không tìm thấy huấn luyện viên này.</div>;

    return (
      <div className="profile-coach-container" style={{ maxWidth: 820, margin: "32px auto", padding: "0 16px" }}>
        {/* Card hồ sơ */}
        <Card
          className="profile-header-card"
          bordered={false}
          style={{
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 16px #ececec",
            borderRadius: 16,
            marginBottom: 32,
          }}
        >
          <Avatar
            size={110}
            src={coach.avatar}
            style={{
              backgroundColor: "#e6f7ff",
              fontSize: 42,
              marginRight: 28,
              border: "2px solid #bae7ff",
            }}
          >
            {coach.full_name?.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Title level={2} style={{ marginBottom: 0 }}>{coach.full_name}</Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              {coach.field || "Chưa cập nhật"}
            </Text>
            <div style={{ margin: "10px 0" }}>
              <Rate disabled value={Math.round(avgRating)} />
              <span style={{ marginLeft: 12, color: "#389e0d", fontWeight: 600, fontSize: 15 }}>
                {validFeedbacks.length
                  ? `${avgRating.toFixed(1)}/5 (${validFeedbacks.length} đánh giá)`
                  : "Chưa có đánh giá"}
              </span>
            </div>
            {/* <Text strong>Chuyên môn: </Text>{coach.speciality || "Chưa cập nhật"}<br />
            <Text strong>Đơn vị: </Text>{coach.organization || "Chưa cập nhật"}<br />
            <Text strong>Kinh nghiệm: </Text>{coach.experience || "Chưa cập nhật"} */}
          </div>
        </Card>

        <Card
          className="profile-description-card"
          bordered={false}
          style={{
            marginBottom: 28,
            boxShadow: "0 1px 8px #f0f0f0",
            borderRadius: 14,
          }}
          title={<Text strong>Mô tả</Text>}
        >
          <Paragraph style={{ marginBottom: 0 }}>{coach.bio || "Chưa có mô tả."}</Paragraph>
        </Card>

        {/* Feedback section */}
        <Card
          className="feedback-section-card"
          title={<span style={{ fontWeight: 600, fontSize: 18 }}>Feedback từ học viên</span>}
          bordered={false}
          style={{
            boxShadow: "0 1px 10px #f8fafc",
            borderRadius: 14,
            marginBottom: 20,
          }}
          extra={
            <span style={{ color: "#1890ff" }}>
              {validFeedbacks.length > 0 && `Tổng cộng: ${validFeedbacks.length}`}
            </span>
          }
        >
          {/* Form gửi feedback mới */}
          <div style={{ marginBottom: 24, background: "#f4faff", padding: 16, borderRadius: 12 }}>
            <Text strong style={{ fontSize: 16 }}>Đánh giá coach</Text>
            <Rate value={myRating} onChange={setMyRating} style={{ marginLeft: 12 }} />
            <Input.TextArea
              value={myComment}
              onChange={e => setMyComment(e.target.value)}
              placeholder="Nội dung đánh giá của bạn..."
              rows={2}
              style={{ marginTop: 10 }}
              maxLength={255}
              showCount
            />
            <Button
              type="primary"
              style={{ marginTop: 10, borderRadius: 6, minWidth: 120 }}
              onClick={handleSendFeedback}
              loading={sending}
              disabled={sending}
            >
              Gửi đánh giá
            </Button>
          </div>
          <Divider />
          {/* Danh sách feedback */}
          <List
            dataSource={validFeedbacks}
            renderItem={item => (
              <List.Item style={{ border: "none", padding: "14px 0" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Avatar size={36} src={item.user_id?.avatar} style={{ backgroundColor: "#d6eaff" }}>
                    {item.user_id?.full_name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div>
                    <b style={{ fontSize: 15 }}>{item.user_id?.full_name || "Ẩn danh"}</b>
                    <Rate disabled value={item.rating} style={{ fontSize: 16, marginLeft: 6 }} />
                    <div style={{ marginTop: 4, color: "#555" }}>{item.comment}</div>
                  </div>
                </div>
              </List.Item>
            )}
            locale={{ emptyText: <Text type="secondary">Chưa có feedback nào.</Text> }}
          />
        </Card>
      </div>
    );
  };

  export default ProfileCoach;
