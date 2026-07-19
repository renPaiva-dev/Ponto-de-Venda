import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "@/app/hooks"
import type { UserRole } from "@/types"

interface ProtectedRouteProps {
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, jwt } = useAppSelector((state) => state.auth)

  if (!jwt || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/acesso-negado" replace />
  }

  return <Outlet />
}
