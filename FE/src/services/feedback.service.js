import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const FeedbackService = {
  // Tạo feedback cho coach
  createFeedbackCoach: (data) => {
    return BaseService.post({
      url: API.FEEDBACK.CREATE_FEEDBACK_COACH,
      payload: data,
      isLoading: true
    });
  },

  // Lấy feedbacks của coach theo coach_user_id
  getFeedbacksByCoach: (coach_user_id) => {
    return BaseService.get({
      url: API.FEEDBACK.GET_FEEDBACKS_BY_COACH.replace(":coach_user_id", coach_user_id),
      isLoading: true
    });
  },

  // Cập nhật feedback của coach
  updateFeedbackCoach: (feedback_id, data) => {
    return BaseService.put({
      url: API.FEEDBACK.UPDATE_FEEDBACK_COACH.replace(":feedback_id", feedback_id),
      data,
      isLoading: true
    });
  },

  // Xoá feedback của coach
  deleteFeedbackCoach: (feedback_id) => {
    return BaseService.delete({
      url: API.FEEDBACK.DELETE_FEEDBACK_COACH.replace(":feedback_id", feedback_id),
      isLoading: true
    });
  },

  // Lấy feedback của coach theo userId
  getCoachFeedbackOfUser: (userId) => {
    return BaseService.get({
      url: API.FEEDBACK.GET_FEEDBACKS_COACH_OF_USER.replace(":userId", userId),
      isLoading: true
    });
  }
};
