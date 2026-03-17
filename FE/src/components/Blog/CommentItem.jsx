import React from "react";

const CommentItem = ({
  comment,
  postId,
  newComment,
  setNewComment,
  onReplyComment,
  onToggleCommentLike,
  isReplyOpen,
  onToggleReply,
}) => {
  const replyKey = `${postId}_${comment._id}`;
  const replyValue = newComment[replyKey] || "";

  const handleReplyChange = (e) => {
    setNewComment((prev) => ({
      ...prev,
      [replyKey]: e.target.value,
    }));
  };

  const handleReplySubmit = () => {
    if (!replyValue.trim()) return;

    onReplyComment(postId, comment._id, replyValue);

    // Clear input
    setNewComment((prev) => ({
      ...prev,
      [replyKey]: "",
    }));
  };

  return (
    <div className="comment-item" style={{ marginBottom: 12 }}>
      <div className="comment-author">
        {comment.user_id?.full_name || "Ẩn danh"}
      </div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-actions">
        <span
          onClick={() =>
            onToggleCommentLike(comment._id, comment.isLikedByMe, postId)
          }
        >
          {comment.likeCount || 0} Like
        </span>
        <span
          style={{ marginLeft: 12, cursor: "pointer" }}
          onClick={() => onToggleReply(comment._id)}
        >
          Trả lời
        </span>
      </div>

      {isReplyOpen && (
        <div className="reply-box" style={{ marginTop: 8, marginLeft: 24 }}>
          <input
            type="text"
            placeholder="Trả lời..."
            value={replyValue}
            onChange={handleReplyChange}
            style={{ padding: "4px 8px", marginRight: "8px", flex: 1 }}
          />
          <button onClick={handleReplySubmit}>Gửi</button>
        </div>
      )}

      {comment.replies?.map((reply) => (
        <div
          key={reply._id}
          className="comment-reply"
          style={{ marginLeft: 24, marginTop: 8 }}
        >
          <div className="comment-author">
            {reply.user_id?.full_name || "Ẩn danh"}
          </div>
          <div className="comment-content">{reply.content}</div>
          <div className="comment-actions">
            <span
              onClick={() =>
                onToggleCommentLike(reply._id, reply.isLikedByMe, postId)
              }
            >
              {reply.likeCount || 0} Like
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentItem;
