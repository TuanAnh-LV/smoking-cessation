import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const TagService = {
  getAllTags: () =>
    BaseService.get({
      url: API.TAG.GET_ALL,
      isLoading: false,
    }),

  getTagById: (id) =>
    BaseService.get({
      url: API.TAG.GET_BY_ID.replace(":id", id),
      isLoading: false,
    }),

  createTag: (data) =>
    BaseService.post({
      url: API.TAG.CREATE,
      data,
      isLoading: true,
    }),

  updateTag: (id, data) =>
    BaseService.put({
      url: API.TAG.UPDATE.replace(":id", id),
      data,
      isLoading: true,
    }),

  deleteTag: (id) =>
    BaseService.delete({
      url: API.TAG.DELETE.replace(":id", id),
      isLoading: true,
    }),
};
