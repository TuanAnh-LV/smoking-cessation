import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  Ellipsis,
  MessageCircle,
  Pencil,
  ThumbsUp,
  Trash2,
} from "lucide-react";

const CommentItem = ({
  comment,
  postId,
  newComment,
  setNewComment,
  onReplyComment,
  onLikeComment = () => {},
  onUpdateComment = () => {},
  onDeleteComment = () => {},
  isReplyOpen,
  replyOpenMap = {},
  onToggleReply,
  currentUserId,
  currentUserRole,
  editingCommentId,
  editingContent,
  setEditingContent = () => {},
  onStartEditing = () => {},
  onCancelEditing = () => {},
  depth = 0,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const replyKey = `${postId}_${comment._id}`;
  const replyValue = newComment[replyKey] || "";
  const authorName = comment.user_id?.full_name || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();
  const createdLabel = comment.createdAt
    ? dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")
    : "Just now";
  const isLiked = Boolean(comment.isLikedByMe);
  const likeCount = Number(comment.likeCount || 0);
  const hasReplies = Array.isArray(comment.replies) && comment.replies.length > 0;
  const isEditing = editingCommentId === comment._id;
  const canManageComment =
    currentUserRole === "admin" || currentUserId === comment.user_id?._id;

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleReplyChange = (event) => {
    setNewComment((prev) => ({
      ...prev,
      [replyKey]: event.target.value,
    }));
  };

  const handleReplySubmit = () => {
    if (!replyValue.trim()) return;

    onReplyComment(postId, comment._id, replyValue);
    setNewComment((prev) => ({
      ...prev,
      [replyKey]: "",
    }));
  };

  const handleEditSubmit = () => {
    if (!editingContent.trim()) return;
    onUpdateComment(comment._id, editingContent);
  };

  return (
    <div
      className={`${
        depth > 0
          ? "ml-4 border-l border-gray-200 pl-4 md:ml-8 md:pl-5"
          : ""
      }`}
    >
      <article className="rounded-[1.5rem] border border-gray-200 bg-white/95 p-4 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-sm font-semibold text-white">
            {authorInitial}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="font-semibold text-gray-900">{authorName}</div>
                <span className="text-xs text-gray-400">{createdLabel}</span>
                {depth > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-500">
                    Reply
                  </span>
                )}
              </div>

              {canManageComment && (
                <div className="relative shrink-0" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <Ellipsis className="h-4 w-4" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-10 z-10 w-36 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => {
                          onStartEditing(comment);
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteComment(comment._id);
                          setMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="mt-3 rounded-[1.25rem] border border-gray-200 bg-gray-50 p-3">
                <textarea
                  rows={3}
                  value={editingContent}
                  onChange={(event) => setEditingContent(event.target.value)}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-900"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onCancelEditing}
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleEditSubmit}
                    className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-gray-700">
                {comment.content}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onLikeComment(comment._id, isLiked, postId)}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                  isLiked
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                Like
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-current">
                  {likeCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onToggleReply(comment._id)}
                className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
              >
                <MessageCircle className="h-4 w-4" />
                Reply
              </button>

              {depth === 0 && hasReplies && (
                <span className="rounded-full bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500">
                  {comment.replies.length} repl{comment.replies.length > 1 ? "ies" : "y"}
                </span>
              )}

            </div>

            {isReplyOpen && (
              <div className="mt-4 rounded-[1.25rem] border border-gray-200 bg-gray-50 p-3">
                <textarea
                  rows={3}
                  placeholder="Write your reply..."
                  value={replyValue}
                  onChange={handleReplyChange}
                  className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-gray-900"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleReply(comment._id)}
                    className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleReplySubmit}
                    className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
                  >
                    Send reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {hasReplies && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              newComment={newComment}
              setNewComment={setNewComment}
              onReplyComment={onReplyComment}
              onLikeComment={onLikeComment}
              onUpdateComment={onUpdateComment}
              onDeleteComment={onDeleteComment}
              isReplyOpen={replyOpenMap[reply._id]}
              replyOpenMap={replyOpenMap}
              onToggleReply={onToggleReply}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              editingCommentId={editingCommentId}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              onStartEditing={onStartEditing}
              onCancelEditing={onCancelEditing}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
