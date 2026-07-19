import { client } from "@/api/client"
import type { AuthResponse } from "@/types"

export function login(email: string, password: string) {
  return client
    .post<AuthResponse>("/auth/login", { email, password })
    .then((res) => res.data)
}

export function signup(fullName: string, email: string, password: string) {
  return client
    .post<AuthResponse>("/auth/signup", { fullName, email, password, role: "ROLE_STORE_ADMIN" })
    .then((res) => res.data)
}
