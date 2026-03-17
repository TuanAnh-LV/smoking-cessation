import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const UserService = {
  getAllUsers: () => {
    return BaseService.get({
      url: API.AUTH.GET_ALL_USER,
      isLoading: true,
      isAuth: true,
    });
  },
  
  getCurrentUser: () => {
    return BaseService.get({
      url: API.USER.GET_CURRENT_USER_INFO,
      isLoading: true,
    });
  },

  updateUser: (data) => {
    return BaseService.put({
      url: API.USER.UPDATE_CURRENT_USER,
      payload: data,
      isLoading: true,
      isAuth: true,
    });
  },

  getUserById: (id) => {
    return BaseService.getById({
      url: API.USER.GET_USER_BY_ID.replace(":id", id),
      isLoading: true,
    });
  },

  deleteUser: (id) => {
    return BaseService.remove({
      url: API.USER.DELETE_USER.replace(":id", id),
      isLoading: true,
    });
  },

  getUserCoach: (id) => {
    return BaseService.get({
      url: API.USER.GET_COACH_OF_USER.replace(":id", id),
      isLoading: true,
    });
  },

  getUserMembership: (id) => {
    return BaseService.get({
      url: API.USER.GET_CURRENT_MEMBERSHIP.replace(":id", id),
      isLoading: true,
    });
  },

  getUserQuitPlans: (id) => {
    return BaseService.get({
      url: API.USER.GET_ALL_QUITPAN_OF_USER.replace(":id", id),
      isLoading: true,
    });
  },
};
