import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const CategoryService = {
  getAllCategories: () =>
    BaseService.get({
      url: API.CATEGORY.GET_ALL,
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
      data,
      isLoading: true,
    }),

  updateCategory: (id, data) =>
    BaseService.put({
      url: API.CATEGORY.UPDATE.replace(":id", id),
      data,
      isLoading: true,
    }),

  deleteCategory: (id) =>
    BaseService.delete({
      url: API.CATEGORY.DELETE.replace(":id", id),
      isLoading: true,
    }),
};
