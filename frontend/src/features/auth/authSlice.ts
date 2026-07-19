import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { AUTH_STORAGE_KEY } from "@/api/client"
import type { User } from "@/types"

interface AuthState {
  user: User | null
  jwt: string | null
}

function loadInitialState(): AuthState {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return { user: null, jwt: null }
  try {
    return JSON.parse(raw) as AuthState
  } catch {
    return { user: null, jwt: null }
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; jwt: string }>) {
      state.user = action.payload.user
      state.jwt = action.payload.jwt
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state))
    },
    logout(state) {
      state.user = null
      state.jwt = null
      localStorage.removeItem(AUTH_STORAGE_KEY)
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
