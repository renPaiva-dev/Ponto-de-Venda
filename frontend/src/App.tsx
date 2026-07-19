import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import ComingSoonPage from "@/pages/ComingSoonPage"
import CaixaTerminalPage from "@/pages/caixa/CaixaTerminalPage"
import GerenteDashboardPage from "@/pages/gerente/GerenteDashboardPage"
import AdminPanelPage from "@/pages/admin/AdminPanelPage"
import StoreAdminPanelPage from "@/pages/loja/StoreAdminPanelPage"
import { ProtectedRoute } from "@/routes/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignupPage />} />

      <Route element={<ProtectedRoute allowedRoles={["ROLE_CASHIER", "ROLE_STORE_ADMIN"]} />}>
        <Route path="/caixa" element={<CaixaTerminalPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_BRANCH_MANAGER", "ROLE_STORE_MANAGER"]} />}>
        <Route path="/gerente" element={<GerenteDashboardPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/admin" element={<AdminPanelPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ROLE_STORE_ADMIN"]} />}>
        <Route path="/loja" element={<StoreAdminPanelPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/em-breve" element={<ComingSoonPage />} />
        <Route path="/acesso-negado" element={<ComingSoonPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
