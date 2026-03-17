import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BlogService } from "../../services/blog.service";
import { CommentService } from "../../services/comment.service";
import BlogPost from "../../components/Blog/BlogPost";

const BlogCategoryPage = () => {
  const { categoryId } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({});
  const [replyOpen, setReplyOpen] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await BlogService.getAllBlogs({ category: categoryId });
        const blogList = res.data.blogs || [];

        // Lấy comment cho từng blog
        const blogWithComments = await Promise.all(
          blogList.map(async (blog) => {
            try {
              const commentRes = await CommentService.getCommentsByBlog(blog._id);
              return {
                ...blog,
                comments: commentRes.data?.comments || [],
              };
            } catch {
              return { ...blog, comments: [] };
            }
          })
        );

        setBlogs(blogWithComments);
      } catch (err) {
        console.error("Error fetching blogs by category:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

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
    <div style={{ padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h2>Bài viết theo chuyên mục</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : blogs.length === 0 ? (
        <p>Không có bài viết nào trong chuyên mục này.</p>
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

export default BlogCategoryPage;
