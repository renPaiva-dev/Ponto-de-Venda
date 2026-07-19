import { client } from "@/api/client"

export interface StoreContact {
  address: string | null
  phone: string | null
  email: string | null
}

export interface Store {
  id: number
  brand: string
  description: string | null
  storeType: string | null
  status: "ACTIVE" | "PENDING" | "BLOCKED"
  contact: StoreContact | null
}

export function getAllStores() {
  return client.get<Store[]>("/api/stores").then((res) => res.data)
}

export function getMyStore() {
  return client.get<Store>("/api/stores/employee").then((res) => res.data)
}

export function createStore(brand: string) {
  return client.post<Store>("/api/stores", { brand }).then((res) => res.data)
}

export interface StoreUpdateRequest {
  brand: string
  description?: string
  storeType?: string
  contact?: StoreContact
}

export function updateStore(storeId: number, request: StoreUpdateRequest) {
  return client.put<Store>(`/api/stores/${storeId}`, request).then((res) => res.data)
}

export function moderateStore(storeId: number, status: Store["status"]) {
  return client
    .put<Store>(`/api/stores/${storeId}/moderate`, null, { params: { status } })
    .then((res) => res.data)
}

export function deleteStore(storeId: number) {
  return client.delete(`/api/stores/${storeId}`)
}
