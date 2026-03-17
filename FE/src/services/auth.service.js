import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const AuthService = {
  login(params) {
    return BaseService.post({
      url: API.AUTH.LOGIN,
      payload: params,
      isLoading: true,
    });
  },
  loginGoogle: (payload) => {
    return BaseService.post({
      url: API.AUTH.LOGIN_GOOGLE,
      payload,
      isLoading: true,
    });
  },
  getUserRole: () => {
    return BaseService.get({
      url: API.USER.GET_CURRENT_USER_INFO,
      isLoading: true,
    });
  },
  register(params) {
    return BaseService.post({
      url: API.AUTH.REGISTER,
      payload: params,
      isLoading: true,
    });
  },
  updateProfile: (data) => {
    return BaseService.put({
      url: API.USER.UPDATE_PROFILE,
      payload: data,
      isLoading: true,
      isFormData: true,
      isAuth: true,
    });
  },
  verifyEmail: (token) => {
    return BaseService.get({
      url: `${API.AUTH.VERIFY_NEW_EMAIL}?token=${token}`,
      isLoading: true,
      disableToast: true,
    });
  },
  
 
  resendEmailCode: () => {
    return BaseService.post({
      url: API.AUTH.RESEND_VERIFICATION_CODE,
      isLoading: true,
      isAuth: true,
    });
  },
  changePassword: (payload) => {
    return BaseService.put({
      url: API.AUTH.CHANGE_PASSWORD,
      payload,
      isAuth: true,
      isLoading: true,
    });
  },
  inviteCoach: (payload) => {
    return BaseService.post({
      url: API.AUTH.INVITE_COACH,
      payload,
      isAuth: true,
      isLoading: true,
    });
  },
  confirmCoachInvite: (payload) => {
    return BaseService.post({
      url: API.AUTH.CONFIRM_COACH,
      payload,
      isLoading: true,
    });
  }
};
