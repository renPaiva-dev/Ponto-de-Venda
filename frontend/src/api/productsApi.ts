import { client } from "@/api/client"
import type { Product } from "@/types"

export interface ProductRequest {
  name: string
  description?: string
  sku?: string
  price: number
  category?: { id: number }
  storeId?: number
  stockQuantity: number
  minStockQuantity: number
}

export function listProducts() {
  return client.get<Product[]>("/produtos").then((res) => res.data)
}

export function createProduct(request: ProductRequest) {
  return client.post<Product>("/produtos", request).then((res) => res.data)
}

export function updateProduct(id: number, request: Partial<ProductRequest>) {
  return client.put<Product>(`/produtos/${id}`, request).then((res) => res.data)
}

export function deleteProduct(id: number) {
  return client.delete(`/produtos/${id}`)
}
