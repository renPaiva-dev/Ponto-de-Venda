export type UserRole =
  | "ROLE_USER"
  | "ROLE_ADMIN"
  | "ROLE_STORE_ADMIN"
  | "ROLE_CASHIER"
  | "ROLE_BRANCH_MANAGER"
  | "ROLE_STORE_MANAGER"

export interface User {
  id: number
  fullName: string
  email: string
  phone: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
  lastLogin: string | null
}

export interface AuthResponse {
  jwt: string
  message: string
  user: User
}

export interface Category {
  id: number
  name: string
  description: string | null
}

export interface Product {
  id: number
  name: string
  description: string | null
  sku: string | null
  price: number
  category: Category | null
  storeId: number | null
  stockQuantity: number
  minStockQuantity: number
  active: boolean
}

export type PaymentMethod = "CARD" | "CASH" | "PIX" | "DIGITAL_WALLET"

export type OrderStatus = "PENDING" | "PAID" | "COMPLETED" | "CANCELLED" | "REFUNDED"

export interface OrderItemRequest {
  productId: number
  quantity: number
  discount: number
}

export interface CreateOrderRequest {
  clientId?: number | null
  paymentMethod: PaymentMethod
  orderDiscount: number
  items: OrderItemRequest[]
}

export interface OrderItemDTO {
  id: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

export interface OrderDTO {
  id: number
  storeId: number
  cashierId: number
  cashierName: string
  clientId: number | null
  items: OrderItemDTO[]
  subtotal: number
  discountTotal: number
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: string
  updatedAt: string | null
}
