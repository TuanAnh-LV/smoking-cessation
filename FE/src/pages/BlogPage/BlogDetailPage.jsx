import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit3,
  Eye,
  FolderOpen,
  MessageCircle,
  Star,
  Trash2,
} from "lucide-react";
import { Modal, message } from "antd";
import dayjs from "dayjs";
import { BlogService } from "../../services/blog.service";
import { CommentService } from "../../services/comment.service";
import CommentItem from "../../components/Blog/CommentItem";
import { useAuth } from "../../context/authContext";
import BlogDeleteModal from "../../components/Blog/BlogDeleteModal";

const estimateReadingTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
};

const normalizeContent = (content = "") => content.replace(/\\n/g, "\n");

const updateCommentTree = (items = [], targetId, updater) =>
  items.map((item) => {
    if (item._id === targetId) {
      return updater(item);
    }

    if (Array.isArray(item.replies) && item.replies.length > 0) {
      return {
        ...item,
        replies: updateCommentTree(item.replies, targetId, updater),
      };
    }

    return item;
  });

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const [blogRes, commentRes] = await Promise.all([
          BlogService.getBlogById(id),
          CommentService.getCommentsByBlog(id),
        ]);
        setPost(blogRes);
        setComments(commentRes?.data?.comments || []);
      } catch (error) {
        console.error("Failed to load blog detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const readingTime = useMemo(
    () => estimateReadingTime(post?.content || post?.description || ""),
    [post],
  );

  const refreshComments = async () => {
    const res = await CommentService.getCommentsByBlog(id);
    setComments(res?.data?.comments || []);
  };

  const handleAddComment = async () => {
    const content = (newComment[id] || "").trim();
    if (!content) return;

    try {
      await CommentService.createComment(id, content);
      setNewComment((prev) => ({ ...prev, [id]: "" }));
      refreshComments();
      message.success("Comment added");
    } catch (error) {
      console.error("Failed to add comment:", error);
      message.error("Failed to add comment");
    }
  };

  const handleReplyComment = async (postId, parentId, replyContent) => {
    const content = replyContent.trim();
    if (!content) return;

    try {
      await CommentService.createComment(postId, content, parentId);
      setNewComment((prev) => ({ ...prev, [`${postId}_${parentId}`]: "" }));
      setActiveReplyId(null);
      refreshComments();
      message.success("Reply added");
    } catch (error) {
      console.error("Failed to reply comment:", error);
      message.error("Failed to reply comment");
    }
  };

  const handleToggleCommentLike = async (commentId, isLiked) => {
    try {
      if (isLiked) {
        await CommentService.unlikeComment(commentId);
      } else {
        await CommentService.likeComment(commentId);
      }

      setComments((prev) =>
        updateCommentTree(prev, commentId, (comment) => ({
          ...comment,
          isLikedByMe: !isLiked,
          likeCount: Math.max(
            0,
            Number(comment.likeCount || 0) + (isLiked ? -1 : 1),
          ),
        })),
      );
    } catch (error) {
      const status = error?.status || error?.error?.response?.status;

      if (!isLiked && (status === 400 || status === 409)) {
        try {
          await CommentService.unlikeComment(commentId);
          setComments((prev) =>
            updateCommentTree(prev, commentId, (comment) => ({
              ...comment,
              isLikedByMe: false,
              likeCount: Math.max(0, Number(comment.likeCount || 0) - 1),
            })),
          );
          return;
        } catch (fallbackError) {
          console.error("Fallback unlike failed:", fallbackError);
        }
      }

      console.error("Failed to update comment like:", error);
      message.error("Failed to update comment");
    }
  };

  const handleStartEditingComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content || "");
  };

  const handleCancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const nextContent = content.trim();
      if (!nextContent) return;

      await CommentService.updateComment(commentId, nextContent);
      handleCancelEditingComment();
      await refreshComments();
      message.success("Comment updated");
    } catch (error) {
      console.error("Failed to update comment:", error);
      message.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    Modal.confirm({
      title: "Delete comment",
      content: "This comment will be removed permanently.",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await CommentService.deleteComment(commentId);
          if (editingCommentId === commentId) {
            handleCancelEditingComment();
          }
          await refreshComments();
          message.success("Comment deleted");
        } catch (error) {
          console.error("Failed to delete comment:", error);
          message.error("Failed to delete comment");
        }
      },
    });
  };

  const handleToggleReply = (commentId) => {
    setActiveReplyId((prev) => (prev === commentId ? null : commentId));
  };

  const handleDeleteBlog = async () => {
    try {
      setDeleting(true);
      await BlogService.deleteBlog(id);
      message.success("Blog deleted successfully");
      navigate("/blogs");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      message.error("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="max-w-5xl mx-auto px-4 py-12">Loading blog...</div>;
  }

  if (!post) {
    return <div className="max-w-5xl mx-auto px-4 py-12">Blog not found.</div>;
  }

  const coverImage = post.images?.[0]?.url || post.images?.[0] || "";
  const displayContent = normalizeContent(post.content || "");
  const canCreateBlog = Boolean(userInfo?._id);
  const canEditOrDelete =
    userInfo?.role === "admin" || userInfo?._id === post.author_id?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate("/blogs")}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </button>

        {canCreateBlog && (
          <div className="flex flex-wrap items-center gap-2">
            {canEditOrDelete && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/blogs/${id}/edit`)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-100"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <article className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {coverImage && (
          <div className="w-full h-[260px] md:h-[420px] bg-gray-100">
            <img
              src={coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              <FolderOpen className="h-4 w-4" />
              {post.category?.name || "General"}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Published{" "}
              {dayjs(post.published_at || post.createdAt).format("DD/MM/YYYY")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4" />
              {readingTime} min read
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-4 text-lg text-gray-600 leading-8">
              {post.description}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-4">
            <div>
              <p className="text-sm text-gray-500">Author</p>
              <p className="font-semibold text-gray-900">
                {post.author_id?.full_name || "Anonymous"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50">
                <Eye className="h-4 w-4" />
                {post.viewCount || 0} views
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50">
                <Star className="h-4 w-4" />
                {Number(post.averageRating || 0).toFixed(1)} (
                {post.ratingCount || 0})
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50">
                <MessageCircle className="h-4 w-4" />
                {comments.length} comments
              </span>
            </div>
          </div>

          {post.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag._id || tag.id}
                  className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 whitespace-pre-wrap text-gray-800 leading-8 text-base md:text-lg">
            {displayContent}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500 flex flex-wrap gap-4">
            <span>
              Updated {dayjs(post.updatedAt).format("DD/MM/YYYY HH:mm")}
            </span>
            <span>Status: {post.status}</span>
          </div>
        </div>
      </article>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-gray-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] shadow-sm">
        <div className="border-b border-gray-200 px-6 py-6 md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Comments</h2>
              <p className="mt-1 text-sm text-gray-500">
                Share your thoughts, react to replies, and keep the discussion
                useful.
              </p>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              {comments.length} total
            </span>
          </div>
        </div>

        <div className="px-6 py-6 md:px-8 md:py-8">
          <div className="mb-8 rounded-[1.75rem] border border-gray-200 bg-white p-4 shadow-[0_14px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-sm font-semibold text-white">
                {(userInfo?.full_name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-900 focus:bg-white"
                  placeholder="Write a comment..."
                  value={newComment[id] || ""}
                  onChange={(event) =>
                    setNewComment((prev) => ({
                      ...prev,
                      [id]: event.target.value,
                    }))
                  }
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-gray-400">
                    Be constructive. Replies and reactions update live after
                    posting.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
                  >
                    Post comment
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
                No comments yet. Start the discussion first.
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postId={id}
                  newComment={newComment}
                  setNewComment={setNewComment}
                  onReplyComment={handleReplyComment}
                  onLikeComment={handleToggleCommentLike}
                  onUpdateComment={handleUpdateComment}
                  onDeleteComment={handleDeleteComment}
                  onToggleReply={handleToggleReply}
                  isReplyOpen={activeReplyId === comment._id}
                  replyOpenMap={{ [activeReplyId]: true }}
                  currentUserId={userInfo?._id}
                  currentUserRole={userInfo?.role}
                  editingCommentId={editingCommentId}
                  editingContent={editingContent}
                  setEditingContent={setEditingContent}
                  onStartEditing={handleStartEditingComment}
                  onCancelEditing={handleCancelEditingComment}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <BlogDeleteModal
        open={deleteModalOpen}
        loading={deleting}
        blogTitle={post.title}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          await handleDeleteBlog();
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
};

export default BlogDetailPage;
