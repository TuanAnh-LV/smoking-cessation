import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const SmokingStatusService = {
  recordSmokingStatus: (planId, stageId, data) => {
    return BaseService.post({
      url: API.SMOKINGSTATUS.RECORD_SMOKING
        .replace(":id", planId)
        .replace(":id", stageId),
      payload: data,
      isLoading: true,
      isAuth: true,
    });
  },

  getAllSmokingStatus: (planId, stageId) => {
    return BaseService.get({
      url: API.SMOKINGSTATUS.GET_ALL_SMOKING
        .replace(":id", planId)
        .replace(":id", stageId),
      isLoading: true,
    });
  },

  recordInitialSmokingStatus: (data) => {
    return BaseService.post({
      url: API.SMOKINGSTATUS.RECORD_INITIAL,
      payload: data,
      isLoading: true,
      isAuth: true,
    });
  },
  getLatestPrePlanStatus: () => {
    return BaseService.get({
      url: API.SMOKINGSTATUS.GET_LAST_SMOKING_STATUS,
      isLoading: true,
      isAuth: true,
    });
  }  
};
