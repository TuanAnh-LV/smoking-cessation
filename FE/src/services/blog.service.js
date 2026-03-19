import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const BlogService = {
  getAllBlogs: (params = {}) => {
    return BaseService.get({
      url: API.BLOG.GET_ALL_BLOG,
      params,
      isLoading: true,
    });
  },

  getBlogById: (id) => {
    return BaseService.get({
      url: API.BLOG.GET_BLOG_BY_ID.replace(":id", id),
      isLoading: true,
    }).then((res) => {
      const payload = res?.data || {};
      return {
        ...(payload.blog || {}),
        averageRating:
          payload.blog?.averageRating ?? payload.averageRating ?? 0,
        ratingCount: payload.blog?.ratingCount ?? payload.ratingCount ?? 0,
      };
    });
  },

  createBlog: (data) => {
    return BaseService.post({
      url: API.BLOG.CREATE_BLOG,
      payload: data,
      isLoading: true,
    });
  },

  updateBlog: (id, data) => {
    return BaseService.put({
      url: API.BLOG.UPDATE_BLOG.replace(":id", id),
      payload: data,
      isLoading: true
    });
  },

  deleteBlog: (id) => {
    return BaseService.remove({
      url: API.BLOG.DELETE_BLOG.replace(":id", id),
      isLoading: true
    });
  },

  likeBlog: (id) => {
    return BaseService.post({
      url: API.BLOG.LIKE_BLOG.replace(":id", id),
      isLoading: false,
    });
  },

  unlikeBlog: (id) => {
    return BaseService.post({
      url: API.BLOG.UNLIKE_BLOG.replace(":id", id),
      isLoading: false,
    });
  },

  shareBadges: (id, shared_badges) => {
    return BaseService.post({
      url: API.BLOG.SHARE_BADGES.replace(":id", id),
      payload: { shared_badges },
      isLoading: true
    });
  }
};
