import { client } from "@/api/client"
import type { CreateOrderRequest, OrderDTO, OrderStatus } from "@/types"

export function createOrder(request: CreateOrderRequest) {
  return client.post<OrderDTO>("/pedidos", request).then((res) => res.data)
}

export function listOrders() {
  return client.get<OrderDTO[]>("/pedidos").then((res) => res.data)
}

export function updateOrderStatus(orderId: number, status: OrderStatus) {
  return client
    .patch<OrderDTO>(`/pedidos/${orderId}/status`, { status })
    .then((res) => res.data)
}
