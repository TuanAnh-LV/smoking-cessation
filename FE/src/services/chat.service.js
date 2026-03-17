import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const ChatService = {
  getOrCreateSession: () => {
    return BaseService.get({  
      url: API.CHAT.GET_OR_CREATE_SESSION,
      isLoading: true,
    });
  },

  getSessionByCoach: () => {
    return BaseService.get({
      url: API.CHAT.GET_SESSION_BY_COACH,
      isLoading: true,
    });
  },

  getMessages: (sessionId) => {
    return BaseService.get({
      url: API.CHAT.GET_MESSAGES.replace(":sessionId", sessionId),
      isLoading: true,
    });
  },

  closeSession: (sessionId) => {
    return BaseService.post({
      url: API.CHAT.CLOSE_SESSION.replace(":sessionId", sessionId),
      isLoading: true,
    });
  },
};
