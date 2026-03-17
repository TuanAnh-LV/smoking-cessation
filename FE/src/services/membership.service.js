import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const MembershipService = {
  getAllMemberships: () => {
    return BaseService.get({
      url: API.MEMBERSHIP.GET_ALL_MEMBERSHIP,
      isLoading: true,
    });
  },

  getMembershipById: (id) => {
    return BaseService.getById({
      url: API.MEMBERSHIP.GET_MEMBERSHIP_BY_ID.replace(":id", id),
      isLoading: true,
    });
  },

  createMembership: (data) => {
    return BaseService.post({
      url: API.MEMBERSHIP.CREATE_MEMBERSHIP,
      payload: data,
      isLoading: true,
      isAuth: true,
    });
  },

  updateMembership: (id, data) => {
    return BaseService.put({
      url: API.MEMBERSHIP.UPDATE_MEMBERSHIP.replace(":id", id),
      payload: data,
      isLoading: true,
      isAuth: true,
    });
  },

  deleteMembership: (id) => {
    return BaseService.remove({
      url: API.MEMBERSHIP.DELETE_MEMBERSHIP.replace(":id", id),
      isLoading: true,
      isAuth: true,
    });
  },
};
