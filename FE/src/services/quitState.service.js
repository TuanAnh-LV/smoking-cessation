import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const QuitStageService = {
  getAllStagesOfPlan: (planId) => {
    return BaseService.get({
      url: API.QUITSTAGE.GET_ALL_STAGE_OF_QUITPLAN.replace(":id", planId),
      isLoading: true,
    });
  },

};

