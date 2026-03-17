import { BaseService } from "../config/basic.service";
import { API } from "../const/path.api";

export const PaymentService = {
  createPaypalOrder: (payload) => {
    return BaseService.post({
      url: API.PAYMENT.CREATE_ORDER_PAYPAL,
      payload,
      isLoading: true,
    });
  },

  acceptPaypalOrder: (payload) => {
    return BaseService.post({
      url: API.PAYMENT.ACCECPT_PAYPAL,
      payload,
      isLoading: true,
    });
  },

  getUserTransactions: () => {
    return BaseService.get({
      url: API.PAYMENT.GET_FOR_USER,
      isLoading: true,
    });
  },

  getAllTransactions: () => {
    return BaseService.get({
      url: API.PAYMENT.GET_ALL_TRANSACTION,
      isLoading: true,
      isAuth: true,
    });
  },
  getTransactionSummary: () => {
  return BaseService.get({
    url: API.PAYMENT.GET_SUMMARY,
    isLoading: true,
    isAuth: true,
  });
},

};
