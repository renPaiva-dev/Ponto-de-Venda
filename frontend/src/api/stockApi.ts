import { client } from "@/api/client"
import type { Product } from "@/types"

export function getStockAlerts() {
  return client.get<Product[]>("/estoque/alertas").then((res) => res.data)
}

export function updateStock(productId: number, quantityChange: number, reason?: string) {
  return client
    .patch<Product>(`/estoque/${productId}`, { quantityChange, reason })
    .then((res) => res.data)
}
