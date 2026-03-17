export const API = {
  COMMON: {
    PUBLIC_CATEGORY: "api/client/category/search",
  },
  AUTH: {
    LOGIN: "/auth/login",
    LOGIN_GOOGLE: "/auth/login/google",
    REGISTER: "/auth/register",
    CHANGE_PASSWORD: "/auth/change-password",
    RESET_PASSWORD: "/auth/reset-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_NEW_EMAIL: "/auth/verify-email",
    GET_ALL_USER: "/users",
    INVITE_COACH: "/auth/invite-coach",
    CONFIRM_COACH: "/auth/coach-invite/confirm",
  },
  USER: {
    GET_CURRENT_USER_INFO: "/users/me",
    UPDATE_CURRENT_USER: "/users/me",
    GET_COACH_OF_USER: "/users/:id/coach",
    GET_CURRENT_MEMBERSHIP: "/users/:id/membership",
    GET_ALL_QUITPAN_OF_USER: "/users/:id/quit-plans",
    GET_USER_BY_ID: "/users/:id",
    DELETE_USER: "/users/:id",
  },
  USERMEMBERSHIP: {
    GET_CURRENT_USERMEMBERSHIP: "/user-membership/me",
    GET_HISTORY: "/user-membership/me/history",
    GET_ALL_USERMEMBERSHIP: "/user-membership",
    GET_MEMBERSHIP_BY_USER_ID: "/user-membership/admin/:id",
    PREVIEW_UPGRADE: "/user-membership/preview-upgrade",
  },
  COACH: {
    CREATE_COACH: "/coaches",
    GET_COACH_RELATIONSHIP: "/coaches",
    UPDATE_COACH: "/coaches/:id",
    DELETE_COACH: "/coaches/:id",
    GET_COACH_BY_ID: "/coaches/:id",
  },
  COACH_USER: {
    CREATE_COACH: "/coach-users",
    GET_ALL_COACH: "/coach-users",
    UPDATE_COACH: "/coach-users/:id",
    DELETE_RELATION: "/coach-users/:id",
    GET_COACH_BY_ID: "/coach-users/:id",
    GET_BY_USER_ID: "/coach-users/by-user/:userId",
  },
  BADGES: {
    GET_ALL_BADGES: "/badges",
    GET_USER_BADGES: "/badges/user",
    GET_UPCOMING_BADGES: "/badges/upcoming",
    CREATE_BADGES: "/badges",
    GET_BADGES_BY_ID: "/badges/:id",
    UPDATE_BADGES: "/badges/:id",
    DELETE_BADGES: "/badges/:id",
    GET_BADGE_SUMMARY: "/badges/summary",
  },
  MEMBERSHIP: {
    CREATE_MEMBERSHIP: "/memberships",
    GET_ALL_MEMBERSHIP: "/memberships",
    GET_MEMBERSHIP_BY_ID: "/memberships/:id",
    UPDATE_MEMBERSHIP: "/memberships/:id",
    DELETE_MEMBERSHIP: "memberships/:id",
  },
  PAYMENT: {
    CREATE_ORDER_PAYPAL: "/payments/paypal/create",
    ACCECPT_PAYPAL: "/payments/paypal/capture",
    GET_FOR_USER: "/transactions/me",
    GET_ALL_TRANSACTION: "/transactions",
    GET_SUMMARY: "/transactions/summary"
  },
  QUITPLAN: {
    GET_ALL_QUITPLAN: "/quit-plans",
    CREATE_QUIT_PLAN: "/quit-plans",
    GET_SUGGESTED_QUITPLAN: "/quit-plans/stage-suggestion",
    GET_QUIT_PLAN_OF_USER: "/quit-plans/user/:id",
    GET_DETAIL_QUITPLAN: "/quit-plans/:id",
    UPDATE_QUITPLAN: "/quit-plans/:id/status",
    GET_QUITPLAN_SUMMARY: "/quit-plans/:id/summary",
  },
  QUITPLANPROGRESS: {
    RECORD_PROGRESS: "/quit-plans/:id/stages/:id/progress",
    GET_ALL_PROGRESS: "/quit-plans/:id/stages/:id/progress",
  },
  QUITSTAGE: {
    GET_ALL_STAGE_OF_QUITPLAN: "/quit-plans/:id/stages",
    CREATE_QUITSTATE: "/quit-plans/:id/stages",
    UPDATE_QUITSTATE: "/quit-plans/:id/stages/:id",
    DELETE_QUITSTATE: "/quit-plans/:id/stages/:id",
   GET_BY_STAGE: "/quit-plans/stage/:stageId/progress",
  },
  SMOKINGSTATUS: {
    RECORD_SMOKING: "/quit-plan/:id/stages/:id/status",
    GET_ALL_SMOKING: "/quit-plan/:id/stages/:id/status",
    RECORD_INITIAL: "/smoking-status/pre-plan",
    GET_LAST_SMOKING_STATUS: "/smoking-status/pre-plan/latest",
  },

  ADMIN: {
    GET_DASHBOARD: "/admin/dashboard",
    GET_ALL_COACHES: "/admin/coaches",
  },
  COMMUNITY: {
    MESSAGES: "/community/messages",
  },
  CHAT: {
    GET_OR_CREATE_SESSION: "/chat/session",
    GET_SESSION_BY_COACH: "/chat/sessions",
    GET_MESSAGES: "/chat/messages/:sessionId",
    CLOSE_SESSION: "/chat/session/:sessionId/close",
  },
  VIDEO: {
    CREATE_USER: "/video/create-user",
    GET_TOKEN: "/video/token",
  },
  NOTIFICATION: {
    GET_ALL: "/notifications",
    MARK_AS_READ: "/notifications/:id/read",
    MARK_ALL_AS_READ: "/notifications/mark-all-read",
    DELETE: "/notifications/:id"
  },
  REMINDER: {
    GET_REMINDER_OF_USER: "/reminders",
    CREATE_REMINDER: "/reminders",
    DELETE_REMINDER: "/reminders/:id",
    UPDATE_REMINDER: "/reminders/:id",
  },
  BLOG: {
    CREATE_BLOG: "/blogs",
    GET_ALL_BLOG: "/blogs",
    GET_BLOG_BY_ID: "/blogs/:id",
    UPDATE_BLOG: "/blogs/:id",
    DELETE_BLOG: "/blogs/:id",
    LIKE_BLOG: "/blogs/:id/like",
    UNLIKE_BLOG: "/blogs/:id/unlike",
    SHARE_BADGES: "/blogs/:id/share-badges"
  },
  CATEGORY: {
    GET_ALL: "/categories",
    GET_BY_ID: "/categories/:id",
    CREATE: "/categories",
    UPDATE: "/categories/:id",
    DELETE: "/categories/:id",
  },
  TAG: {
    GET_ALL: "/tags",
    GET_BY_ID: "/tags/:id",
    CREATE: "/tags",
    UPDATE: "/tags/:id",
    DELETE: "/tags/:id",
  },
  COMMENT: {
    CREATE_COMMENT: "/blogs/:id/comments",
    GET_COMMENTS_BY_BLOG: "/blogs/:id/comments",
    LIKE_COMMENT: "/comments/:id/like",
    UNLIKE_COMMENT: "/comments/:id/unlike",
    UPDATE_COMMENT: "/comments/:id",
    DELETE_COMMENT: "/comments/:id",
    REPLY_COMMENT: "/comments/:id/reply"
  },
  QUITPLANDRAFT: {
    CREATE_QUITPLANDRAFT: "/quit-goal-draft",
    GET_QUITPLANDRAFT: "/quit-goal-draft",
    DELETE_QUITPLANDRAFT: "/quit-goal-draft"
  },
  FEEDBACK: {
    CREATE_FEEDBACK_COACH: "/feedback/coach",
    GET_FEEDBACKS_BY_COACH: "/feedback/coach/:coach_user_id",
    UPDATE_FEEDBACK_COACH: "/feedback/coach/:feedback_id",
    DELETE_FEEDBACK_COACH: "/feedback/coach/:feedback_id",
    GET_FEEDBACKS_COACH_OF_USER: "/feedback/coach-of-user/:userId"
  },
};
