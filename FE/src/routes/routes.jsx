import { lazy } from "react";
import { ROUTER_URL } from "../const/router.const";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./protected/protectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Common Pages
const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage/Login"));
const RegisterPage = lazy(() => import("../pages/RegisterPage/Register"));
const StatusPage = lazy(() => import("../pages/StatusPage/StatusPage"));
const QuitPlan = lazy(() => import("../pages/QuitPlan/QuitPlan"));
const ProgressPage = lazy(() => import("../pages/ProgressPage/ProgressPage"));
const AchievementPage = lazy(() => import("../pages/AchievementPage/AchievementPage"));
const CommunityPage = lazy(() => import("../pages/CommunityPage/CommunityPage"));
const CommunityChat = lazy(() => import("../components/Community/CommunityChat"));
const ProfilePage = lazy(() => import("../pages/ProfilePage/ProfilePage"));
const PaymentPage = lazy(() => import("../pages/PaymentPage/PaymentPage"));
const PaymentSuccess = lazy(() => import("../pages/PaymentPage/PaymentSuccess"));
const CoachPage = lazy(() => import("../pages/CoachPage/CoachPage"));
const ProfileCoach = lazy(() => import("../pages/ProfileCoach/ProfileCoach"));
const CallPage = lazy(() => import("../pages/CallPage/CallPage"));
const VerifyEmailPage = lazy(() => import("../pages/RegisterPage/VerifyEmailPage"));

// Blog Pages
const BlogCreatePage = lazy(() => import("../pages/BlogPage/BlogPage"));
const BlogCategoryListPage = lazy(() => import("../pages/BlogPage/BlogCategoryListPage"));
const BlogCategoryPage = lazy(() => import("../pages/BlogPage/BlogCategoryPage"));
const BlogDetailPage = lazy(() => import("../pages/BlogPage/BlogDetailPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/Dashboard/Admin/AdminDashboard"));
const BadgesManagement = lazy(() => import("../pages/Dashboard/Admin/BadgesManagement"));
const CoachesManagement = lazy(() => import("../pages/Dashboard/Admin/CoachesManagement"));
const MembershipsManagement = lazy(() => import("../pages/Dashboard/Admin/MembershipsManagement"));
const QuitPlansManagement = lazy(() => import("../pages/Dashboard/Admin/QuitPlansManagement"));
const TransactionsManagement = lazy(() => import("../pages/Dashboard/Admin/TransactionsManagement"));
const UsersManagement = lazy(() => import("../pages/Dashboard/Admin/UsersManagement"));
const AddEditCoachPage = lazy(() => import("../components/admin/AddEditCoachPage"));
const BadgeFormPage = lazy(() => import("../components/admin/BadgeFormPage"));

// Coach Pages
const CoachDashboard = lazy(() => import("../pages/Dashboard/Coach/CoachDashboard"));
const ChatMessage = lazy(() => import("../pages/Dashboard/Coach/ChatMessage"));
const QuitPlansCoach = lazy(() => import("../pages/Dashboard/Coach/QuitPlansCoach"));
const CoachUser = lazy(() => import("../pages/Dashboard/Coach/CoachUser"));
const CoachUserDetail = lazy(() => import("../pages/Dashboard/Coach/CoachUserDetail"));

const routes = [
  // Public routes
  {
    element: <MainLayout />,
    children: [
      { path: ROUTER_URL.COMMON.HOME, element: <HomePage /> },
      { path: ROUTER_URL.COMMON.LOGIN, element: <LoginPage /> },
      { path: ROUTER_URL.COMMON.REGISTER, element: <RegisterPage /> },
      { path: ROUTER_URL.COMMON.STATUS, element: <StatusPage /> },
      { path: ROUTER_URL.COMMON.TRACKPROGRESS, element: <ProgressPage /> },
      { path: ROUTER_URL.COMMON.QUITPLAN, element: <QuitPlan /> },
      { path: ROUTER_URL.COMMON.COMMUNITY, element: <CommunityPage /> },
      { path: ROUTER_URL.COMMON.COMMUNITY_CHAT, element: <CommunityChat /> },
      { path: ROUTER_URL.COMMON.COACH, element: <CoachPage /> },
      { path: ROUTER_URL.COMMON.ACHIEVEMENTS, element: <AchievementPage /> },
      { path: ROUTER_URL.COMMON.PROFILE, element: <ProfilePage /> },
      { path: ROUTER_URL.COMMON.PROFILE_COACH_DETAIL, element: <ProfileCoach /> },
      { path: ROUTER_URL.COMMON.PROFILE_COACH, element: <ProfileCoach /> },
      { path: ROUTER_URL.COMMON.PAYMENT, element: <PaymentPage /> },
      { path: ROUTER_URL.COMMON.PAYMENT_SUCCESS, element: <PaymentSuccess /> },
      { path: "/blogs", element: <BlogCategoryListPage /> },
      { path: "/blogs/category/:categoryId", element: <BlogCategoryPage /> },
      { path: "/blogs/:id", element: <BlogDetailPage /> },
      { path: "/blogs/create", element: <BlogCreatePage /> },
      { path: ROUTER_URL.COMMON.CALL_PAGE, element: <CallPage /> },
      { path: ROUTER_URL.COMMON.VERIFY_EMAIL, element: <VerifyEmailPage /> },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout role="admin" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "badges", element: <BadgesManagement /> },
      { path: "coaches", element: <CoachesManagement /> },
      { path: "coaches/new", element: <AddEditCoachPage /> },
      { path: "coaches/:id", element: <AddEditCoachPage /> },
      { path: "badges/create", element: <BadgeFormPage /> },
      { path: "badges/:id", element: <BadgeFormPage /> },
      { path: "memberships", element: <MembershipsManagement /> },
      { path: "quit-plans", element: <QuitPlansManagement /> },
      { path: "transactions", element: <TransactionsManagement /> },
      { path: "users", element: <UsersManagement /> },
    ],
  },

  // Coach routes
  {
    path: "/coach",
    element: (
      <ProtectedRoute allowedRoles={["coach"]}>
        <DashboardLayout role="coach" />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CoachUser /> },
      { path: "chat", element: <ChatMessage /> },
      { path: "quitplan-coach", element: <QuitPlansCoach /> },
      { path: "user", element: <CoachUser /> },
      { path: "user/:id", element: <CoachUserDetail /> },
    ],
  },

  // Member fallback
  {
    path: "/member",
    element: (
      <ProtectedRoute allowedRoles={["member"]}>
        <MainLayout />
      </ProtectedRoute>
    ),
  },

  // Unauthorize page
  {
    path: "/unauthorize",
    element: (
      <div className="text-center text-red-500 text-xl mt-20">
        403 – Không có quyền truy cập
      </div>
    ),
  },
];

export default routes;
