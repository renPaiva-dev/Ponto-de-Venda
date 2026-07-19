import { useEffect, useState } from "react"
import { toast } from "sonner"
import { AlertTriangle, Building2, ReceiptText, Wallet } from "lucide-react"
import { getAllStores } from "@/api/storesApi"
import { getBranchMetrics, type BranchMetrics } from "@/api/reportsApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export default function VisaoGeralTab() {
  const [metrics, setMetrics] = useState<BranchMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const stores = await getAllStores()
        const results = await Promise.all(
          stores.map((store) => getBranchMetrics(store.id).catch(() => null)),
        )
        setMetrics(results.filter((m): m is BranchMetrics => m !== null))
      } catch {
        toast.error("Nao foi possivel carregar a visao geral")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.storeId} className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-primary" />
              {metric.storeName}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <ReceiptText className="h-3.5 w-3.5" />
                Pedidos
              </span>
              <span className="font-medium">{metric.totalOrders}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 text-muted-foreground font-normal">
                <Wallet className="h-3.5 w-3.5" />
                Receita
              </span>
              <span className="text-primary">{currency.format(metric.totalRevenue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <AlertTriangle className="h-3.5 w-3.5" />
                Alertas de estoque
              </span>
              <Badge variant={metric.lowStockCount > 0 ? "destructive" : "secondary"}>
                {metric.lowStockCount}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
      {metrics.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhuma loja cadastrada ainda</p>
      )}
    </div>
  )
}
