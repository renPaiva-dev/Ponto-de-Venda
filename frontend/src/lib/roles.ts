import type { UserRole } from "@/types"

export const ROLE_LABELS: Record<UserRole, string> = {
  ROLE_USER: "Usuario",
  ROLE_CASHIER: "Caixa",
  ROLE_BRANCH_MANAGER: "Gerente de filial",
  ROLE_STORE_MANAGER: "Gerente de loja",
  ROLE_STORE_ADMIN: "Administrador da loja",
  ROLE_ADMIN: "Administrador da rede",
}

export const ASSIGNABLE_ROLES: UserRole[] = [
  "ROLE_CASHIER",
  "ROLE_BRANCH_MANAGER",
  "ROLE_STORE_MANAGER",
  "ROLE_STORE_ADMIN",
  "ROLE_ADMIN",
]

// Papeis que um STORE_ADMIN (dono de uma unica loja) pode atribuir - o backend
// bloqueia ROLE_ADMIN/ROLE_STORE_ADMIN pra quem nao e ja ROLE_ADMIN (ver
// EmployeeServiceImpl.assertCanAssignRole), entao nem oferecemos essas opcoes aqui.
export const STORE_ASSIGNABLE_ROLES: UserRole[] = [
  "ROLE_CASHIER",
  "ROLE_BRANCH_MANAGER",
  "ROLE_STORE_MANAGER",
]
