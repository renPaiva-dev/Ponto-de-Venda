import { client } from "@/api/client"

export interface Client {
  id: number
  name: string
  email: string | null
  phone: string | null
  document: string | null
  address: string | null
  createdAt: string
}

export interface ClientRequest {
  name: string
  email?: string
  phone?: string
  document?: string
  address?: string
}

export function listClients() {
  return client.get<Client[]>("/clientes").then((res) => res.data)
}

export function createClient(request: ClientRequest) {
  return client.post<Client>("/clientes", request).then((res) => res.data)
}
