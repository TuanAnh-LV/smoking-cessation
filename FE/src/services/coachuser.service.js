import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const CoachUserService = {
  createRelation: (payload) => {
    return BaseService.post({
      url: API.COACH_USER.CREATE_COACH,
      payload,
      isAuth: true,
      isLoading: true,
    });
  },
  getRelations: (params = {}) => {
    return BaseService.get({
      url: API.COACH_USER.GET_ALL_COACH,
      params,
      isAuth: true,
      isLoading: true,
    });
  },
  updateRelation: (id, payload) => {
    return BaseService.patch({
      url: API.COACH_USER.UPDATE_COACH.replace(":id", id),
      payload,
      isAuth: true,
      isLoading: true,
    });
  },
  deleteRelation: (id) => {
    return BaseService.delete({
      url: API.COACH_USER.DELETE_RELATION.replace(":id", id),
      isAuth: true,
      isLoading: true,
    });
  },
  getById: (id) => {
  return BaseService.get({
    url: API.COACH_USER.GET_COACH_BY_ID.replace(":id", id),
    isAuth: true,
    isLoading: true,
  });
},

  getByUserId: (userId) => {
    return BaseService.get({
      url: API.COACH_USER.GET_BY_USER_ID.replace(":userId", userId),
      isAuth: true,
      isLoading: false, 
    });
  },

};
