import { client } from "@/api/client"
import type { PaymentMethod } from "@/types"

export interface SalesSummary {
  startDate: string
  endDate: string
  totalOrders: number
  totalRevenue: number
  averageTicket: number
}

export interface BranchMetrics {
  storeId: number
  storeName: string
  totalOrders: number
  totalRevenue: number
  lowStockCount: number
}

export interface ShiftReport {
  cashierId: number
  cashierName: string
  date: string
  totalOrders: number
  totalRevenue: number
  paymentMethodBreakdown: Partial<Record<PaymentMethod, number>>
}

export function getSalesSummary(startDate: string, endDate: string) {
  return client
    .get<SalesSummary>("/relatorios/vendas", { params: { startDate, endDate } })
    .then((res) => res.data)
}

export function getBranchMetrics(storeId: number) {
  return client.get<BranchMetrics>(`/relatorios/filial/${storeId}`).then((res) => res.data)
}

export function getShiftReport(cashierId: number, date: string) {
  return client
    .get<ShiftReport>("/relatorios/turno", { params: { cashierId, date } })
    .then((res) => res.data)
}
