import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const CategoryService = {
  getAllCategories: (params = {}) =>
    BaseService.get({
      url: API.CATEGORY.GET_ALL,
      params,
      isLoading: false,
    }),

  getCategoryById: (id) =>
    BaseService.get({
      url: API.CATEGORY.GET_BY_ID.replace(":id", id),
      isLoading: false,
    }),

  createCategory: (data) =>
    BaseService.post({
      url: API.CATEGORY.CREATE,
      payload: data,
      isLoading: true,
    }),

  updateCategory: (id, data) =>
    BaseService.put({
      url: API.CATEGORY.UPDATE.replace(":id", id),
      payload: data,
      isLoading: true,
    }),

  deleteCategory: (id) =>
    BaseService.remove({
      url: API.CATEGORY.DELETE.replace(":id", id),
      isLoading: true,
    }),
};
