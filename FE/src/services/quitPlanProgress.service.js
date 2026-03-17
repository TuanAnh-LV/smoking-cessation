import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const QuitPlanProgressService = {
  recordProgress: (planId, stageId, data) => {
    return BaseService.post({
      url: API.QUITPLANPROGRESS.RECORD_PROGRESS
        .replace(":id", planId)
        .replace(":id", stageId),
      payload: data,
      isLoading: true,
      isAuth: true,
    });
  },

  getAllProgress: (planId, stageId) => {
    return BaseService.get({
      url: API.QUITPLANPROGRESS.GET_ALL_PROGRESS
        .replace(":id", planId)
        .replace(":id", stageId),
      isLoading: true,
    });
  },
    getStageProgress: (stageId) => {
  return BaseService.get({
    url: API.QUITSTAGE.GET_BY_STAGE.replace(":stageId", stageId),
    isAuth: true,
  });
}
};
