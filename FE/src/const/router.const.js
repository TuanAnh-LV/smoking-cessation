export const ROUTER_URL = {
  COMMON:{
    LOGIN: "/login",
    LOGIN_GOOGLE: "/google-login",
    REGISTER: "/register",
    CHANGE_PASSWORD: "/change-password",
    RESET_PASSWORD: "/reset-password",
    FORGOT_PASSWORD: "/forgot-password",
    VERIFY_NEW_EMAIL: "/verify-email",
    HOME:"/",
    COMMUNITY:"/chat",
    COMMUNITY_CHAT: "/community-chat",
    BLOG:"/blog",
    ACHIEVEMENTS:"/achievements",
    TRACKPROGRESS:"/progress/:id",
    STATUS:"/status",
    COACH:"/coach",
    QUITPLAN:"/quit-plan",
    PROFILE:"/profile",
    PROFILE_COACH:"/profile-coach",
    PROFILE_COACH_DETAIL: "/profile-coach/:id",
    PAYMENT:"/payment",
    PAYMENT_SUCCESS:"payment-success",
    CALL_PAGE:"/call/:id",
    VERIFY_EMAIL:"/verify-email",
    GOAL_DRAFT:"/goal-draft"
  },
  USER: {
    GET_CURRENT_USER_INFO: "/users/me",
    UPDATE_CURRENT_USER: "/users",
    GET_COACH_OF_USER:"/users/:id/coach",
    GET_CURRENT_MEMBERSHIP:"/users/:id/membership",
    GET_ALL_QUITPAN_OF_USER:"/users/:id/quit-plans",
    GET_USER_BY_ID:"/users/:id",
    DELETE_USER:"/users/:id"
  },
  USERMEMBERSHIP:{
    GET_CURRENT_USERMEMBERSHIP:"/user-membership/me",
    GET_HISTORY:"/user-membership/me/history",
    GET_ALL_USERMEMBERSHIP:"/user-membership"

  },
  ADMIN: {
    MANAGE_DASHBOARD:"",
    MANAGE_BADGE:"badges",
    MANAGE_COACH:"coaches",
    MANAGE_MEMBERSHIP:"memberships",
    MANAGE_QUITPLAN:"quit-plans",
    MANAGE_TRANSACTION:"transactions",
    MANAGE_USER:"users",
  },
  BADGES:{
    GET_ALL_BADGES:"/badges",
    CREATE_BADGES:"/badges",
    GET_BADGES_BY_ID:"/badges/:id",
    UPDATE_BADGES:"/badges/:id",
    DELETE_BADGES:"/badges/:id"
  },
  MEMBERSHIP:{
    CREATE_MEMBERSHIP:"/memberships",
    GET_ALL_MEMBERSHIP:"/memberships",
    GET_MEMBERSHIP_BY_ID:"/memberships/:id",
    UPDATE_MEMBERSHIP:"/memberships/:id",
    DELETE_MEMBERSHIP:"memberships/:id"
  },
  PAYMENT:{
    CREATE_ORDER_PAYPAL:"/payments/paypal/create",
    ACCECPT_PAYPAL:"/payments/paypal/capture",
    GET_FOR_USER:"/transactions/me",
    GET_ALL_TRANSACTION:"/admin/transactions"
  },
  QUITPLAN:{
    CREATE_QUIT_PLAN:"/quit-plans",
    GET_QUIT_PLAN_OF_USER:"/quit-plans/:id",
    GET_DETAIL_QUITPLAN_OF_USER:"/quit-plans/:id",
    UPDATE_QUITPLAN:"/quit-plans/:id/status"
  },
  QUITPLANPROGRESS:{
    RECORD_PROGRESS:"/quit-plans/:id/stages/:id/progress",
    GET_ALL_PROGRESS:"/quit-plans/:id/stages/:id/progress",
  },
  QUITSTAGE:{
    GET_ALL_STAGE_OF_QUITPLAN:"/quit-plans/:id/stages"
  },
  SMOKINGSTATUS:{
    RECORD_SMOKING:"/quit-plan/:id/stages/:id/status",
    GET_ALL_SMOKING:"/quit-plan/:id/stages/:id/status"
  },
   FEEDBACK: {
    COACH_FEEDBACK: "/coach/:id/feedback", 
    USER_FEEDBACK_TO_COACH: "/feedback/my", 
  },
    UNAUTHORIZED: "/unauthorize"
  };