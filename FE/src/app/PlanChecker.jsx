import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { QuitPlanService } from "../services/quitPlan.service";

const PlanChecker = () => {
  const { userInfo, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Không gọi lại nếu đã kiểm tra hoặc thiếu dữ liệu auth
    if (!token || !userInfo?._id || checked) return;

    const verifyPlan = async () => {
      const storedPlanId = localStorage.getItem("currentPlanId");

      if (storedPlanId) {
        try {
          const res = await QuitPlanService.getQuitPlanDetail(storedPlanId);
          if (res?.status === "ongoing") {
            setChecked(true);
            return;
          } else {
            localStorage.removeItem("currentPlanId");
          }
        } catch {
          localStorage.removeItem("currentPlanId");
        }
      }

      try {
        const plansRes = await QuitPlanService.getUserQuitPlans(userInfo._id);
        const plans = plansRes.data;
        const activePlan = plans.find((p) => p.status === "ongoing");
        if (activePlan) {
          localStorage.setItem("currentPlanId", activePlan._id);
          window.dispatchEvent(new Event("storage"));

          // ✅ Chỉ redirect nếu đang ở trang "/"
          if (location.pathname === "/") {
            navigate(`/progress/${activePlan._id}`);
          }
        }
      } catch (err) {
        console.error("Lỗi getUserQuitPlans:", err);
      }

      setChecked(true);
    };

    verifyPlan();
  }, [token, userInfo, checked, navigate, location.pathname]);

  return null;
};

export default PlanChecker;
