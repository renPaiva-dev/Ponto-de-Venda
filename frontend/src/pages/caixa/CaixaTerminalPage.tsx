import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  AlertTriangle,
  Banknote,
  CreditCard,
  LayoutGrid,
  Minus,
  Plus,
  Printer,
  Receipt as ReceiptIcon,
  Search,
  ShoppingCart,
  Trash2,
  Wallet,
} from "lucide-react"
import { listProducts } from "@/api/productsApi"
import { createOrder, updateOrderStatus } from "@/api/ordersApi"
import { payWithStripe } from "@/api/paymentsApi"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  addProduct,
  clearCart,
  removeItem,
  setItemDiscount,
  setOrderDiscount,
  setPaymentMethod,
  setQuantity,
} from "@/features/cart/cartSlice"
import type { OrderDTO, PaymentMethod, Product } from "@/types"

import { AppHeader } from "@/components/layout/AppHeader"
import { PageContainer } from "@/components/layout/PageContainer"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Dinheiro",
  CARD: "Cartao",
  PIX: "PIX",
  DIGITAL_WALLET: "Carteira digital",
}

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, typeof Banknote> = {
  CASH: Banknote,
  CARD: CreditCard,
  PIX: Wallet,
  DIGITAL_WALLET: Wallet,
}

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export default function CaixaTerminalPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const { items, orderDiscount, paymentMethod } = useAppSelector((state) => state.cart)

  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [finalizing, setFinalizing] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<OrderDTO | null>(null)
  const [pendingCardOrder, setPendingCardOrder] = useState<OrderDTO | null>(null)

  useEffect(() => {
    listProducts()
      .then(setProducts)
      .catch(() => toast.error("Nao foi possivel carregar os produtos"))
      .finally(() => setLoadingProducts(false))
  }, [])

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.sku?.toLowerCase().includes(term),
    )
  }, [products, search])

  const itemsDiscountTotal = items.reduce((sum, item) => sum + item.discount, 0)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discountTotal = itemsDiscountTotal + orderDiscount
  const total = Math.max(0, subtotal - discountTotal)

  async function handleFinalizeSale() {
    if (items.length === 0) {
      toast.error("Adicione ao menos um produto ao carrinho")
      return
    }

    setFinalizing(true)
    try {
      const order = await createOrder({
        paymentMethod,
        orderDiscount,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          discount: item.discount,
        })),
      })

      if (paymentMethod === "CARD") {
        try {
          await payWithStripe(order.id)
          const paid = await updateOrderStatus(order.id, "PAID")
          setCompletedOrder(paid)
          dispatch(clearCart())
        } catch {
          toast.error(
            "Pagamento por cartao falhou (gateway sem chave real configurada). O pedido foi criado como pendente.",
          )
          setPendingCardOrder(order)
        }
      } else {
        const paid = await updateOrderStatus(order.id, "PAID")
        setCompletedOrder(paid)
        dispatch(clearCart())
      }
    } catch {
      toast.error("Nao foi possivel finalizar a venda")
    } finally {
      setFinalizing(false)
    }
  }

  async function handleConfirmPendingPayment() {
    if (!pendingCardOrder) return
    try {
      const paid = await updateOrderStatus(pendingCardOrder.id, "PAID")
      setCompletedOrder(paid)
      setPendingCardOrder(null)
      dispatch(clearCart())
    } catch {
      toast.error("Nao foi possivel marcar o pedido como pago")
    }
  }

  return (
    <PageContainer>
      <AppHeader
        icon={ShoppingCart}
        title="Terminal do Caixa"
        subtitle="Registro de vendas"
        actions={
          user?.role === "ROLE_STORE_ADMIN" ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate("/loja")}
            >
              <LayoutGrid className="h-4 w-4" />
              Painel
            </Button>
          ) : undefined
        }
      />

      {pendingCardOrder && (
        <Alert variant="destructive" className="bg-card">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Pagamento pendente</AlertTitle>
          <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Pedido #{pendingCardOrder.id} criado, mas o pagamento por cartao nao foi confirmado.
            </span>
            <Button size="sm" onClick={handleConfirmPendingPayment}>
              Marcar como pago manualmente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="border-none shadow-sm ring-1 ring-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Produtos</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {loadingProducts ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => dispatch(addProduct(product))}
                    disabled={product.stockQuantity <= 0}
                    className="flex flex-col items-start gap-1.5 rounded-xl border bg-card p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md disabled:pointer-events-none disabled:opacity-40"
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-sm font-semibold text-primary">
                      {currency.format(product.price)}
                    </span>
                    <Badge
                      variant={product.stockQuantity > 0 ? "secondary" : "destructive"}
                      className="gap-1"
                    >
                      {product.stockQuantity <= product.minStockQuantity && (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      Estoque: {product.stockQuantity}
                    </Badge>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                    Nenhum produto encontrado.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShoppingCart className="h-4 w-4 text-primary" />
              Carrinho
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Desc.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell className="max-w-24 truncate">{item.product.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            dispatch(
                              setQuantity({
                                productId: item.product.id,
                                quantity: item.quantity - 1,
                              }),
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            dispatch(
                              setQuantity({
                                productId: item.product.id,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.discount}
                        className="w-20"
                        onChange={(e) =>
                          dispatch(
                            setItemDiscount({
                              productId: item.product.id,
                              discount: Number(e.target.value),
                            }),
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {currency.format(item.product.price * item.quantity - item.discount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => dispatch(removeItem(item.product.id))}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Carrinho vazio
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="orderDiscount">Desconto no total</Label>
              <Input
                id="orderDiscount"
                type="number"
                min={0}
                step="0.01"
                value={orderDiscount}
                onChange={(e) => dispatch(setOrderDiscount(Number(e.target.value)))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Forma de pagamento</Label>
              <Select
                value={paymentMethod}
                onValueChange={(value) => dispatch(setPaymentMethod(value as PaymentMethod))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => {
                    const Icon = PAYMENT_METHOD_ICONS[value as PaymentMethod]
                    return (
                      <SelectItem key={value} value={value}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {label}
                        </span>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid gap-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Descontos</span>
                <span>-{currency.format(discountTotal)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-primary">{currency.format(total)}</span>
              </div>
            </div>

            <Button disabled={finalizing} onClick={handleFinalizeSale} size="lg" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              {finalizing ? "Finalizando..." : "Finalizar venda"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!completedOrder} onOpenChange={(open) => !open && setCompletedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ReceiptIcon className="h-4 w-4" />
              Recibo - Pedido #{completedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {completedOrder && (
            <div id="receipt-print-area" className="grid gap-3 text-sm">
              <div className="grid gap-1">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.productName}
                    </span>
                    <span>{currency.format(item.total)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currency.format(completedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Descontos</span>
                <span>-{currency.format(completedOrder.discountTotal)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{currency.format(completedOrder.total)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Pagamento</span>
                <span>{PAYMENT_METHOD_LABELS[completedOrder.paymentMethod]}</span>
              </div>
              <Button variant="outline" onClick={() => window.print()} className="gap-2">
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
