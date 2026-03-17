import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const QuitPlanService = {
  createQuitPlan: (payload) => {
    return BaseService.post({
      url: API.QUITPLAN.CREATE_QUIT_PLAN,
      payload,
      isLoading: true,
      isAuth: true,
    });
  },
  getSuggestedQuitPlan: () => {
    return BaseService.get({
      url: API.QUITPLAN.GET_SUGGESTED_QUITPLAN,
      isLoading: true,
      isAuth: true,
    });
  } ,
  getUserQuitPlans: (id) => {
    return BaseService.get({
      url: API.QUITPLAN.GET_QUIT_PLAN_OF_USER.replace(":id", id),
      isLoading: true,
    });
  },

  getQuitPlanDetail: (id) => {
    return BaseService.get({
      url: API.QUITPLAN.GET_DETAIL_QUITPLAN.replace(":id", id),
      isLoading: true,
    });
  },

  updateQuitPlanStatus: (id, status) => {
    return BaseService.put({
      url: API.QUITPLAN.UPDATE_QUITPLAN.replace(":id", id),
      payload: { status },
      isLoading: true,
      isAuth: true,
    });
  },
  getPlanSummary: (planId) => {
    return BaseService.get({
      url: API.QUITPLAN.GET_QUITPLAN_SUMMARY.replace(":id",planId),
      isLoading: true,
      isAuth: true,
    });
  },
  getAllQuitPlans: () => {
    return BaseService.get({
      url: API.QUITPLAN.GET_ALL_QUITPLAN,
      isLoading: true,
      isAuth: true,
    });
  }
};
