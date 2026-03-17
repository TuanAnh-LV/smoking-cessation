import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const CommentService = {
  getCommentsByBlog: (blogId, params = {}) => {
    return BaseService.get({
      url: API.COMMENT.GET_COMMENTS_BY_BLOG.replace(":id", blogId),
      params,
      isLoading: false
    });
  },

  createComment: (blogId, content) => {
    return BaseService.post({
      url: API.COMMENT.CREATE_COMMENT.replace(":id", blogId),
      payload: { content },
      isLoading: false
    });
  },

  updateComment: (commentId, content) => {
    return BaseService.put({
      url: API.COMMENT.UPDATE_COMMENT.replace(":id", commentId),
      data: { content },
      isLoading: false
    });
  },

  deleteComment: (commentId) => {
    return BaseService.delete({
      url: API.COMMENT.DELETE_COMMENT.replace(":id", commentId),
      isLoading: false
    });
  },

  likeComment: (commentId) => {
    return BaseService.post({
      url: API.COMMENT.LIKE_COMMENT.replace(":id", commentId),
      isLoading: false
    });
  },

  unlikeComment: (commentId) => {
    return BaseService.post({
      url: API.COMMENT.UNLIKE_COMMENT.replace(":id", commentId),
      isLoading: false
    });
  },

  replyComment: (commentId, content) => {
    return BaseService.post({
      url: API.COMMENT.REPLY_COMMENT.replace(":id", commentId),
      payload: { content },
      isLoading: false
    });
  },
};
