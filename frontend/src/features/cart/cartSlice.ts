import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PaymentMethod, Product } from "@/types"

export interface CartItem {
  product: Product
  quantity: number
  discount: number
}

interface CartState {
  items: CartItem[]
  orderDiscount: number
  paymentMethod: PaymentMethod
}

const initialState: CartState = {
  items: [],
  orderDiscount: 0,
  paymentMethod: "CASH",
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      const existing = state.items.find((item) => item.product.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ product: action.payload, quantity: 1, discount: 0 })
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
    },
    setQuantity(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId)
      if (item) item.quantity = Math.max(1, action.payload.quantity)
    },
    setItemDiscount(state, action: PayloadAction<{ productId: number; discount: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.productId)
      if (item) item.discount = Math.max(0, action.payload.discount)
    },
    setOrderDiscount(state, action: PayloadAction<number>) {
      state.orderDiscount = Math.max(0, action.payload)
    },
    setPaymentMethod(state, action: PayloadAction<PaymentMethod>) {
      state.paymentMethod = action.payload
    },
    clearCart(state) {
      state.items = []
      state.orderDiscount = 0
      state.paymentMethod = "CASH"
    },
  },
})

export const {
  addProduct,
  removeItem,
  setQuantity,
  setItemDiscount,
  setOrderDiscount,
  setPaymentMethod,
  clearCart,
} = cartSlice.actions
export default cartSlice.reducer
