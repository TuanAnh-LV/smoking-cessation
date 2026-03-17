import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const QuitGoalDraftService = {
  // Gửi goal draft
  createGoalDraft: (payload) => {
    return BaseService.post({
      url: API.QUITPLANDRAFT.CREATE_QUITPLANDRAFT,
      payload,
      isAuth: true,
      isLoading: true,
    });
  },

  // Lấy goal draft hiện tại
  getGoalDraft: () => {
    return BaseService.get({
      url: API.QUITPLANDRAFT.GET_QUITPLANDRAFT,
      isAuth: true,
      isLoading: true,
    });
  },

  // Xoá goal draft
  deleteGoalDraft: () => {
    return BaseService.delete({
      url: API.QUITPLANDRAFT.DELETE_QUITPLANDRAFT,
      isAuth: true,
      isLoading: true,
    });
  },
};
