import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Package, Pencil, Plus, Trash2 } from "lucide-react"
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
  type ProductRequest,
} from "@/api/productsApi"
import { listCategories } from "@/api/categoriesApi"
import { getAllStores, type Store } from "@/api/storesApi"
import type { Category, Product } from "@/types"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

const emptyForm = {
  name: "",
  price: "",
  stockQuantity: "",
  minStockQuantity: "",
  categoryId: "",
  storeId: "",
}

interface ProdutosTabProps {
  restrictToStoreId?: number
}

export default function ProdutosTab({ restrictToStoreId }: ProdutosTabProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  async function loadAll() {
    setLoading(true)
    try {
      const [productsData, categoriesData, storesData] = await Promise.all([
        listProducts(),
        listCategories(),
        restrictToStoreId ? Promise.resolve([]) : getAllStores(),
      ])
      setProducts(productsData)
      setCategories(categoriesData)
      setStores(storesData)
    } catch {
      toast.error("Nao foi possivel carregar os produtos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function buildRequest(): ProductRequest | null {
    const storeId = restrictToStoreId ?? Number(form.storeId)
    if (!form.name.trim() || !form.price || !storeId) {
      toast.error("Preencha nome, preco e loja")
      return null
    }
    return {
      name: form.name.trim(),
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity || 0),
      minStockQuantity: Number(form.minStockQuantity || 0),
      storeId,
      category: form.categoryId ? { id: Number(form.categoryId) } : undefined,
    }
  }

  async function handleCreate() {
    const request = buildRequest()
    if (!request) return
    setCreating(true)
    try {
      await createProduct(request)
      setForm(emptyForm)
      toast.success("Produto criado")
      await loadAll()
    } catch {
      toast.error("Nao foi possivel criar o produto")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(productId: number) {
    try {
      await deleteProduct(productId)
      toast.success("Produto excluido")
      await loadAll()
    } catch {
      toast.error("Nao foi possivel excluir o produto")
    }
  }

  async function handleSaveEdit() {
    if (!editingProduct) return
    try {
      await updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: editingProduct.price,
        category: editingProduct.category ? { id: editingProduct.category.id } : undefined,
      })
      toast.success("Produto atualizado")
      setEditingProduct(null)
      await loadAll()
    } catch {
      toast.error("Nao foi possivel atualizar o produto")
    }
  }

  function storeName(storeId: number | null) {
    return stores.find((s) => s.id === storeId)?.brand ?? "-"
  }

  return (
    <div className="grid gap-4">
      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-primary" />
            Novo produto
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Nome</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label>Preco</Label>
            <Input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          {!restrictToStoreId && (
            <div className="grid gap-2">
              <Label>Loja</Label>
              <Select value={form.storeId} onValueChange={(v) => setForm({ ...form, storeId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={String(store.id)}>
                      {store.brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid gap-2">
            <Label>Categoria</Label>
            <Select
              value={form.categoryId}
              onValueChange={(v) => setForm({ ...form, categoryId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Estoque inicial</Label>
            <Input
              type="number"
              value={form.stockQuantity}
              onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Estoque minimo</Label>
            <Input
              type="number"
              value={form.minStockQuantity}
              onChange={(e) => setForm({ ...form, minStockQuantity: e.target.value })}
            />
          </div>
          <div className="flex items-end sm:col-span-3">
            <Button disabled={creating} onClick={handleCreate} className="w-full sm:w-auto">
              {creating ? "Criando..." : "Criar produto"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-primary" />
            Produtos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preco</TableHead>
                  <TableHead>Estoque</TableHead>
                  {!restrictToStoreId && <TableHead>Loja</TableHead>}
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{currency.format(product.price)}</TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
                    {!restrictToStoreId && <TableCell>{storeName(product.storeId)}</TableCell>}
                    <TableCell className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={restrictToStoreId ? 4 : 5}
                      className="text-center text-muted-foreground"
                    >
                      Nenhum produto cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label>Nome</Label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Preco</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <Select
                  value={editingProduct.category ? String(editingProduct.category.id) : ""}
                  onValueChange={(v) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: categories.find((c) => c.id === Number(v)) ?? null,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveEdit}>Salvar</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
