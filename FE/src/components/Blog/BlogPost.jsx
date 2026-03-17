import React, { useState } from "react";
import { Avatar, Divider, Tag, Typography } from "antd";
import dayjs from "dayjs";
import CommentItem from "./CommentItem";
import "./BlogPost.scss";

const BlogPost = ({
  post,
  comments = [],
  newComment = {},
  setNewComment = () => {},
  onAddComment = () => {},
  onReplyComment = () => {},
  onToggleLike = () => {},
  onToggleCommentLike = () => {},
  onToggleReply = () => {},
  replyOpen = {},
}) => {
  const [visibleCount, setVisibleCount] = useState(2);

  if (!post) return null;

  const {
    _id,
    title,
    description,
    content,
    category,
    tags = [],
    images = [],
    author_id = {},
    createdAt,
  } = post;

  const visibleComments = comments.slice(0, visibleCount);

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setNewComment((prev) => ({
      ...prev,
      [_id]: value,
    }));
  };

  return (
    <div className="blog-post">
      <div className="post-header">
        <Avatar className="avatar">
          {author_id?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
        <div>
          <div className="author">{author_id?.full_name || "Ẩn danh"}</div>
          <div className="date">{dayjs(createdAt).format("DD/MM/YYYY")}</div>
        </div>
      </div>

      <Typography.Title level={3} className="post-title">
        {title}
      </Typography.Title>

      {description && <div className="post-description">{description}</div>}

      <div className="post-tags">
        {category && <Tag color="blue">#{category?.name}</Tag>}
        {tags.map((tag) => (
          <Tag key={tag._id}>#{tag.name}</Tag>
        ))}
      </div>

      <div className="post-content">{content}</div>

      {images.length > 0 && (
        <div className="post-images">
          {images.map((img, index) => (
            <img key={index} src={img.url || img} alt={`blog-img-${index}`} />
          ))}
        </div>
      )}

      <Divider />

      {/* Bình luận */}
      <div className="comment-section">
        <input
          placeholder="Viết bình luận..."
          value={newComment[_id] || ""}
          onChange={handleCommentChange}
        />
        <button onClick={() => onAddComment(_id)}>Gửi</button>
      </div>

      <div className="comments">
        {visibleComments.map((cmt) => (
          <CommentItem
            key={cmt._id}
            comment={cmt}
            postId={_id}
            newComment={newComment}
            setNewComment={setNewComment}
            onReplyComment={onReplyComment}
            onToggleCommentLike={onToggleCommentLike}
            replyOpen={replyOpen}
            onToggleReply={onToggleReply}
            isReplyOpen={replyOpen[cmt._id]}
          />
        ))}

        {comments.length > visibleCount && (
          <button onClick={() => setVisibleCount((prev) => prev + 5)}>
            Xem thêm bình luận ({comments.length - visibleCount})
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
