import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Plus, Tag } from "lucide-react"
import { createCategory, listCategories } from "@/api/categoriesApi"
import type { Category } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function CategoriasTab() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadCategories() {
    setLoading(true)
    try {
      setCategories(await listCategories())
    } catch {
      toast.error("Nao foi possivel carregar as categorias")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  async function handleCreate() {
    if (!name.trim()) {
      toast.error("Informe o nome da categoria")
      return
    }
    setCreating(true)
    try {
      await createCategory(name.trim(), description.trim() || undefined)
      setName("")
      setDescription("")
      toast.success("Categoria criada")
      await loadCategories()
    } catch {
      toast.error("Nao foi possivel criar a categoria")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-primary" />
            Nova categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            placeholder="Descricao (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button disabled={creating} onClick={handleCreate}>
            {creating ? "Criando..." : "Criar categoria"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Tag className="h-4 w-4 text-primary" />
            Categorias
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
                  <TableHead>Descricao</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description ?? "-"}</TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Nenhuma categoria cadastrada
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
