import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const VideoService = {
  //Upsert user lên Stream (gọi khi login xong hoặc trước khi vào call)
  createStreamUser: () => {
    return BaseService.post({
      url: API.VIDEO.CREATE_USER,
      isLoading: false,
    });
  },

  // Lấy token từ BE để init StreamVideoClient
  getStreamToken: () => {
    return BaseService.get({
      url: API.VIDEO.GET_TOKEN,
      isLoading: false,
    });
  },
};
