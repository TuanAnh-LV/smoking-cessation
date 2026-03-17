import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const NotificationService = {
  getAll: () =>
    BaseService.get({
      url: API.NOTIFICATION.GET_ALL,
      isLoading: false,
      isAuth: true,
    }),

  markAsRead: (id) =>
    BaseService.patch({
      url: API.NOTIFICATION.MARK_AS_READ.replace(":id", id),
      isLoading: false,
      isAuth: true,
    }),

  markAllAsRead: () =>
    BaseService.post({
      url: API.NOTIFICATION.MARK_ALL_AS_READ,
      isLoading: false,
      isAuth: true,
    }),

  delete: (id) =>
    BaseService.remove({
      url: API.NOTIFICATION.DELETE.replace(":id", id),
      isLoading: false,
      isAuth: true,
    }),
    deleteAll: () =>
        BaseService.remove({
          url: "/notifications/clear-all",
          isAuth: true,
          isLoading: true,
        }),
      
};
