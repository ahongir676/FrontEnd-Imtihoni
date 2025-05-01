import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { ReactNode } from "react";

const RoleChecker = ({
  roles,
  children,
}: {
  roles: string[];
  children: ReactNode;
}) => {
  const { user } = useAuthStore((store) => store);
  if (!user.role) return <Navigate to="/login" />;
  if (user.role && !roles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

export default RoleChecker;
