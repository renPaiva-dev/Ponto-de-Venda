import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Building2, Plus, Store as StoreIcon, Trash2 } from "lucide-react"
import { createStore, deleteStore, getAllStores, moderateStore, type Store } from "@/api/storesApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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

const STATUS_LABELS: Record<Store["status"], string> = {
  ACTIVE: "Ativa",
  PENDING: "Pendente",
  BLOCKED: "Bloqueada",
}

export default function LojasTab() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [newBrand, setNewBrand] = useState("")
  const [creating, setCreating] = useState(false)

  async function loadStores() {
    setLoading(true)
    try {
      setStores(await getAllStores())
    } catch {
      toast.error("Nao foi possivel carregar as lojas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStores()
  }, [])

  async function handleCreate() {
    if (!newBrand.trim()) {
      toast.error("Informe o nome da loja")
      return
    }
    setCreating(true)
    try {
      await createStore(newBrand.trim())
      setNewBrand("")
      toast.success("Loja criada")
      await loadStores()
    } catch {
      toast.error("Nao foi possivel criar a loja")
    } finally {
      setCreating(false)
    }
  }

  async function handleModerate(storeId: number, status: Store["status"]) {
    try {
      await moderateStore(storeId, status)
      toast.success("Status atualizado")
      await loadStores()
    } catch {
      toast.error("Nao foi possivel atualizar o status")
    }
  }

  async function handleDelete(storeId: number) {
    try {
      await deleteStore(storeId)
      toast.success("Loja excluida")
      await loadStores()
    } catch {
      toast.error("Nao foi possivel excluir a loja")
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-primary" />
            Nova loja
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input
            placeholder="Nome da loja"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
          />
          <Button disabled={creating} onClick={handleCreate}>
            {creating ? "Criando..." : "Criar loja"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            Lojas da rede
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <StoreIcon className="h-4 w-4 text-muted-foreground" />
                      {store.brand}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={store.status}
                        onValueChange={(value) =>
                          handleModerate(store.id, value as Store["status"])
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(store.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {stores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhuma loja cadastrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
