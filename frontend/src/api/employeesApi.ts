import { client } from "@/api/client"
import type { User, UserRole } from "@/types"

export interface EmployeeRequest {
  fullName: string
  email: string
  phone?: string
  password?: string
  role: UserRole
  storeId?: number
}

export function listEmployees() {
  return client.get<User[]>("/funcionarios").then((res) => res.data)
}

export function createEmployee(request: EmployeeRequest) {
  return client.post<User>("/funcionarios", request).then((res) => res.data)
}

export function updateEmployee(id: number, request: Partial<EmployeeRequest>) {
  return client.put<User>(`/funcionarios/${id}`, request).then((res) => res.data)
}
