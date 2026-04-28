import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HomeRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "director") {
      navigate("/employerDashboard");
    } else if (user.role === "manager") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return null;
};

export default HomeRedirect;