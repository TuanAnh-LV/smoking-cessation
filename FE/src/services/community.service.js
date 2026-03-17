import { BaseService } from "../config/basic.service";
import { API} from "../const/path.api";

export const CommunityService = {
  getMessages: () => {
    return BaseService.get({
      url: API.COMMUNITY.MESSAGES,
      isLoading: true
    });
  },
};
