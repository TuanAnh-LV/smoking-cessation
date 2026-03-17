import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const BadgeService = {
  getAllBadges: () => {
    return BaseService.get({
      url: API.BADGES.GET_ALL_BADGES,
      isLoading: true,
    });
  },

  createBadge: (data) => {
    return BaseService.post({
      url: API.BADGES.CREATE_BADGES,
      payload: data,
      isLoading: true,
      isAuth: true,
    });
  },

  getBadgeById: (id) => {
    return BaseService.getById({
      url: API.BADGES.GET_BADGES_BY_ID.replace(":id", id),
      isLoading: true,
    });
  },

  updateBadge: (id, data) => {
    return BaseService.put({
      url: API.BADGES.UPDATE_BADGES.replace(":id", id),
      payload: data,
      isLoading: true,
      isAuth: true,
    });
  },

  deleteBadge: (id) => {
    return BaseService.remove({
      url: API.BADGES.DELETE_BADGES.replace(":id", id),
      isLoading: true,
      isAuth: true,
    });
  },
  getUserBadges: () => {
    return BaseService.get({
      url: API.BADGES.GET_USER_BADGES,
      isLoading: true,
      isAuth: true
    });
  },
  getUpcomingBadges: () => {
    return BaseService.get({
      url: API.BADGES.GET_UPCOMING_BADGES, 
      isLoading: true,
      isAuth: true
    });
  },
  getBadgeSummary: () => {
    return BaseService.get({
      url: API.BADGES.GET_BADGE_SUMMARY,
      isLoading: true,
      isAuth: true
    });
  }
};
