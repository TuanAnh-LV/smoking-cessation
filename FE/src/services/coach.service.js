import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const CoachService = {
  getAllCoaches: () => {
    return BaseService.get({
      url: API.COACH.GET_COACH_RELATIONSHIP,
      isAuth: true,
      isLoading: true,
    });
  },
createCoach: (formData) => {
    return BaseService.post({
      url: API.COACH.CREATE_COACH,
      payload: formData,
      isAuth: true,
      isLoading: true,
    });
  },
  getCoachById: (id) => {
    return BaseService.get({
      url: API.COACH.GET_COACH_BY_ID.replace(":id", id),
      isAuth: true,
      isLoading: true,
    });
  },

  updateCoach: (id, formData) => {
    return BaseService.patch({
      url: API.COACH.UPDATE_COACH.replace(":id", id),
      payload: formData,
      isAuth: true,
      isLoading: true,
    });
  },

  deleteCoach: (id) => {
    return BaseService.remove({
      url: API.COACH.DELETE_COACH.replace(":id", id),
      isAuth: true,
      isLoading: true,
    });
  },
};
