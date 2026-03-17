import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const AdminService = {
  // Dashboard stats
  getDashboard: () => {
    return BaseService.get({
      url: API.ADMIN.GET_DASHBOARD,
      isAuth: true,
      isLoading: true,
    });
  },

  // Gửi reminder đến user
  sendReminder: (payload) => {
    return BaseService.post({
      url: API.ADMIN.SEND_REMINDER,
      payload,
      isAuth: true,
      isLoading: true,
    });
  },

  // CRUD Coach
  getAllCoaches: () => {
    return BaseService.get({
      url: API.ADMIN.GET_ALL_COACHES,
      isAuth: true,
      isLoading: true,
    });
  },
};
