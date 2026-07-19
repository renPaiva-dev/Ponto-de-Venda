import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  BarChart3,
  Clock,
  LayoutDashboard,
  ReceiptText,
  ShoppingBag,
  Wallet,
} from "lucide-react"
import { getMyStore, type Store } from "@/api/storesApi"
import { getSalesSummary, getShiftReport, type ShiftReport } from "@/api/reportsApi"
import { getStockAlerts } from "@/api/stockApi"
import { listOrders } from "@/api/ordersApi"
import { listEmployees } from "@/api/employeesApi"
import { startOfToday, toLocalDateString, toLocalDateTimeString } from "@/lib/date"
import type { OrderDTO, Product, User } from "@/types"

import { AppHeader } from "@/components/layout/AppHeader"
import { PageContainer } from "@/components/layout/PageContainer"
import { StatCard } from "@/components/StatCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  COMPLETED: "Concluido",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
}

export default function GerenteDashboardPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [ordersToday, setOrdersToday] = useState(0)
  const [revenueToday, setRevenueToday] = useState(0)
  const [averageTicket, setAverageTicket] = useState(0)
  const [stockAlerts, setStockAlerts] = useState<Product[]>([])
  const [recentOrders, setRecentOrders] = useState<OrderDTO[]>([])
  const [employees, setEmployees] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [shiftCashierId, setShiftCashierId] = useState<string>("")
  const [shiftDate, setShiftDate] = useState(toLocalDateString(new Date()))
  const [shiftReport, setShiftReport] = useState<ShiftReport | null>(null)
  const [loadingShift, setLoadingShift] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [storeData, salesSummary, alerts, orders, employeesData] = await Promise.all([
          getMyStore(),
          getSalesSummary(toLocalDateTimeString(startOfToday()), toLocalDateTimeString(new Date())),
          getStockAlerts(),
          listOrders(),
          listEmployees(),
        ])
        setStore(storeData)
        setOrdersToday(salesSummary.totalOrders)
        setRevenueToday(salesSummary.totalRevenue)
        setAverageTicket(salesSummary.averageTicket)
        setStockAlerts(alerts)
        setRecentOrders(
          [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 10),
        )
        setEmployees(employeesData)
      } catch {
        toast.error("Nao foi possivel carregar o dashboard")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleShiftReport() {
    if (!shiftCashierId) {
      toast.error("Selecione um funcionario")
      return
    }
    setLoadingShift(true)
    try {
      const report = await getShiftReport(Number(shiftCashierId), shiftDate)
      setShiftReport(report)
    } catch {
      toast.error("Nao foi possivel gerar o relatorio de turno")
    } finally {
      setLoadingShift(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <AppHeader
        icon={LayoutDashboard}
        title="Dashboard do Gerente"
        subtitle={store?.brand ?? "Sua loja"}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={ShoppingBag} label="Pedidos hoje" value={ordersToday} accent="info" />
        <StatCard
          icon={Wallet}
          label="Receita hoje"
          value={currency.format(revenueToday)}
          accent="success"
        />
        <StatCard
          icon={BarChart3}
          label="Ticket medio"
          value={currency.format(averageTicket)}
          accent="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Alertas de estoque baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead>Minimo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockAlerts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{product.stockQuantity}</Badge>
                    </TableCell>
                    <TableCell>{product.minStockQuantity}</TableCell>
                  </TableRow>
                ))}
                {stockAlerts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhum alerta no momento
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ReceiptText className="h-4 w-4 text-primary" />
              Pedidos recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Caixa</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.cashierName}</TableCell>
                    <TableCell>{currency.format(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Nenhum pedido ainda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-primary" />
            Relatorio de turno
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label>Funcionario</Label>
              <Select value={shiftCashierId} onValueChange={setShiftCashierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={String(employee.id)}>
                      {employee.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shiftDate">Data</Label>
              <Input
                id="shiftDate"
                type="date"
                value={shiftDate}
                onChange={(e) => setShiftDate(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button disabled={loadingShift} onClick={handleShiftReport} className="w-full">
                {loadingShift ? "Gerando..." : "Gerar relatorio"}
              </Button>
            </div>
          </div>

          {shiftReport && (
            <div className="grid gap-1 rounded-xl border bg-muted/40 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Funcionario</span>
                <span>{shiftReport.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pedidos no turno</span>
                <span>{shiftReport.totalOrders}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Receita no turno</span>
                <span className="text-primary">{currency.format(shiftReport.totalRevenue)}</span>
              </div>
              {Object.entries(shiftReport.paymentMethodBreakdown).map(([method, amount]) => (
                <div key={method} className="flex justify-between text-muted-foreground">
                  <span>{method}</span>
                  <span>{currency.format(amount ?? 0)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  )
}
