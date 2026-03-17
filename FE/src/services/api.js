import axios from "axios";
import Cookies from "js-cookie";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: "https://67dda021e00db03c406c656d.mockapi.io",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

// Cấu hình interceptor cho request
api.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu cần
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cấu hình interceptor cho response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý các lỗi thông thường
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Xử lý lỗi unauthorized
          Cookies.remove("token");
          localStorage.removeItem("user");
          //   window.location.href = '/login';
          break;
        case 403:
          console.error("Không có quyền truy cập");
          break;
        case 404:
          console.error("Không tìm thấy tài nguyên");
          break;
        case 500:
          console.error("Lỗi server");
          break;
        default:
          console.error("Đã xảy ra lỗi");
      }
    }
    return Promise.reject(error);
  }
);

// Các phương thức API
const apiClient = {
  // Lấy danh sách
  get: async (url) => {
    const response = await api.get(url);
    return response.data;
  },

  // Tạo mới
  post: async (url, data) => {
    const response = await api.post(url, data);
    return response.data;
  },

  // Cập nhật
  put: async (url, data) => {
    const response = await api.put(url, data);
    return response.data;
  },

  // Xóa
  delete: async (url) => {
    const response = await api.delete(url);
    return response.data;
  },

  // Cập nhật một phần
  patch: async (url, data) => {
    const response = await api.patch(url, data);
    return response.data;
  },
};

export default apiClient;
