import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const UserMembershipService = {
  getCurrentUserMembership: () => {
    return BaseService.get({
      url: API.USERMEMBERSHIP.GET_CURRENT_USERMEMBERSHIP,
      isLoading: true,
    });
  },

  getUserMembershipHistory: () => {
    return BaseService.get({
      url: API.USERMEMBERSHIP.GET_HISTORY,
      isLoading: true,
    });
  },

  getAllUserMemberships: () => {
    return BaseService.get({
      url: API.USERMEMBERSHIP.GET_ALL_USERMEMBERSHIP,
      isLoading: true,
    });
  },
  
  getByUserId: (id) => {
    return BaseService.get({
      url: API.USERMEMBERSHIP.GET_MEMBERSHIP_BY_USER_ID.replace(":id", id),
      isAuth: true,
    });
  },

  previewUpgrade: (newPackageId) => {
    return BaseService.post({
      url: API.USERMEMBERSHIP.PREVIEW_UPGRADE,
      payload: { newPackageId },
      isAuth: true,
      isLoading: true,
    });
  },
};
