import React, { useEffect, useState } from "react";
import { Button, Typography, Divider, Spin, Tag } from "antd";
import { CategoryService } from "../../services/category.service";
import { BlogService } from "../../services/blog.service";
import { useNavigate } from "react-router-dom";
import BlogPost from "../../components/Blog/BlogPost";
import { CommentService } from "../../services/comment.service";

const BlogCategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({});
  const [replyOpen, setReplyOpen] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy danh sách category
    CategoryService.getAllCategories().then((res) => {
      setCategories(res?.data?.categories || []);
    });

    // Lấy toàn bộ blog + comment
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await BlogService.getAllBlogs();
        const blogList = res.data.blogs || [];

        const blogWithComments = await Promise.all(
          blogList.map(async (blog) => {
            try {
              const cmtRes = await CommentService.getCommentsByBlog(blog._id);
              return {
                ...blog,
                comments: cmtRes.data?.comments || [],
              };
            } catch {
              return { ...blog, comments: [] };
            }
          })
        );

        setBlogs(blogWithComments);
      } catch (err) {
        console.error("Lỗi khi load blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleAddComment = async (postId) => {
    const content = newComment[postId]?.trim();
    if (!content) return;

    try {
      await CommentService.createComment(postId, content);
      const res = await CommentService.getCommentsByBlog(postId);
      const updatedComments = res.data?.comments || [];

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === postId ? { ...b, comments: updatedComments } : b
        )
      );

      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
    }
  };

  const handleReplyComment = async (postId, parentId, replyContent) => {
    const content = replyContent?.trim();
    if (!content) return;

    try {
      await CommentService.replyComment(parentId, content);
      const res = await CommentService.getCommentsByBlog(postId);
      const updatedComments = res.data?.comments || [];

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === postId ? { ...b, comments: updatedComments } : b
        )
      );

      setNewComment((prev) => ({ ...prev, [`${postId}_${parentId}`]: "" }));
    } catch (err) {
      console.error("Lỗi khi trả lời bình luận:", err);
    }
  };

  const handleToggleCommentLike = async (commentId, isLiked, postId) => {
    try {
      if (isLiked) {
        await CommentService.unlikeComment(commentId);
      } else {
        await CommentService.likeComment(commentId);
      }

      const res = await CommentService.getCommentsByBlog(postId);
      const updatedComments = res.data?.comments || [];

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === postId ? { ...b, comments: updatedComments } : b
        )
      );
    } catch (err) {
      console.error("Lỗi khi like bình luận:", err);
    }
  };

  const handleToggleReply = (commentId) => {
    setReplyOpen((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Typography.Title level={2}>Chuyên mục bài viết</Typography.Title>
        <Button type="primary" onClick={() => navigate("/blogs/create")}>
          + Tạo Blog mới
        </Button>
      </div>

      <div
        className="category-tags"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {categories.map((cat) => (
          <Tag
            key={cat._id}
            color="blue"
            style={{
              cursor: "pointer",
              fontSize: "1rem",
              padding: "6px 12px",
              borderRadius: 20,
            }}
            title={cat.description}
            onClick={() => navigate(`/blogs/category/${cat._id}`)}
          >
            {cat.name}
          </Tag>
        ))}
      </div>

      <Divider />
      <Typography.Title level={3}>Tất cả bài viết</Typography.Title>

      {loading ? (
        <Spin />
      ) : blogs.length === 0 ? (
        <p>Không có bài viết nào.</p>
      ) : (
        blogs.map((post) => (
          <BlogPost
            key={post._id}
            post={post}
            comments={post.comments}
            newComment={newComment}
            setNewComment={setNewComment}
            onAddComment={handleAddComment}
            onReplyComment={handleReplyComment}
            onToggleCommentLike={handleToggleCommentLike}
            onToggleReply={handleToggleReply}
            replyOpen={replyOpen}
          />
        ))
      )}
    </div>
  );
};

export default BlogCategoryListPage;
