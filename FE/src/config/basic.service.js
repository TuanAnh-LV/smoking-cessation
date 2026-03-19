import { startLoading, stopLoading } from "../app/loadingSlice";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getItemInLocalStorage } from '../utils/localStorage';
import store from "../app/store";
import { DOMAIN_ADMIN, LOCAL_STORAGE } from '../const/const';
import { ROUTER_URL } from '../const/router.const';
import { HttpException } from '../app/toastException';

export const axiosInstance = axios.create({
  baseURL: DOMAIN_ADMIN,
  headers: {
    'content-type': 'application/json; charset=UTF-8'
  },
  timeout: 300000,
  timeoutErrorMessage: `Connection timeout exceeded`
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (!config.headers) config.headers = {};
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);


axiosInstance.interceptors.response.use(
  (res) => {
    if (res.config?.__showGlobalLoading) {
      store.dispatch(stopLoading());
    }
    return res;
  },
  (err) => {
    if (err.config?.__showGlobalLoading) {
      store.dispatch(stopLoading());
    }
    const { response } = err;
    if (response?.status === 401) {
      localStorage.clear();
      window.location.href = ROUTER_URL.LOGIN;
    }
     if (response?.status === 403 && !localStorage.getItem('token')) {
     console.warn("403 Forbidden - likely due to missing token on public page");
      return Promise.reject(err);
    }
    handleErrorByToast(err);
    return Promise.reject(
      new HttpException(
        response?.data?.error ||
          response?.data?.message ||
          err.message ||
          "An unexpected error occurred.",
        response?.status || 500,
        err
      )
    );
  }
);

// ✅ Hiện loading nếu cần
const checkLoading = (isLoading = false) => {
  if (isLoading) {
    store.dispatch(startLoading());
  }
};

// ✅ Toast lỗi
const handleErrorByToast = (error) => {
  const messages =
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.message;
  toast.error(messages);
  return null;
};

// ✅ Service chung
export const BaseService = {
  get({ url, isLoading = true, params = {}, headers = {} }) {
    const cleanedParams = { ...params };
    for (const key in cleanedParams) {
      if (cleanedParams[key] === '' && cleanedParams[key] !== 0) {
        delete cleanedParams[key];
      }
    }
    checkLoading(isLoading);
    return axiosInstance.get(url, {
      params: cleanedParams,
      headers,
      __showGlobalLoading: isLoading,
    });
  },

  post({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);

    const isFormData = payload instanceof FormData;
    const finalHeaders = {
      ...headers,
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
    };
  
    return axiosInstance.post(url, payload, {
      headers: finalHeaders,
      __showGlobalLoading: isLoading,
    });
  },

  put({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);

    const isFormData = payload instanceof FormData;
    const finalHeaders = {
      ...headers,
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
    };
  
    return axiosInstance.put(url, payload, {
      headers: finalHeaders,
      __showGlobalLoading: isLoading,
    });
  },
  

  remove({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);
    return axiosInstance.delete(url, {
      params: payload,
      headers,
      __showGlobalLoading: isLoading,
    });
  },

  getById({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);
    return axiosInstance.get(url, {
      params: payload,
      headers,
      __showGlobalLoading: isLoading,
    });
  },
  patch({ url, isLoading = true, payload = {}, headers = {} }) {
    checkLoading(isLoading);

    const isFormData = payload instanceof FormData;
    const finalHeaders = {
      ...headers,
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
    };

    return axiosInstance.patch(url, payload, {
      headers: finalHeaders,
      __showGlobalLoading: isLoading,
    });
  },


  uploadMedia(url, file, isMultiple = false, isLoading = true) {
    const formData = new FormData();
    if (isMultiple) {
      for (let i = 0; i < file.length; i++) {
        formData.append("files[]", file[i]);
      }
    } else {
      formData.append("file", file);
    }

    const user = getItemInLocalStorage(LOCAL_STORAGE.ACCOUNT_ADMIN);
    checkLoading(isLoading);

    return axios({
      method: "post",
      url: `${DOMAIN_ADMIN}${url}`,
      data: formData,
      headers: {
        "content-type": "multipart/form-data",
        "Authorization": `Bearer ${user?.access_token || ''}`,
      }
    })
      .then((res) => {
        if (isLoading) {
          store.dispatch(stopLoading());
        }
        return res.data;
      })
      .catch((error) => {
        if (isLoading) {
          store.dispatch(stopLoading());
        }
        handleErrorByToast(error);
        return null;
      });
  }
};
