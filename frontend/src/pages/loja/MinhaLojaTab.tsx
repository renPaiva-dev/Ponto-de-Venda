import { useState } from "react"
import { toast } from "sonner"
import { Save, Store as StoreIcon } from "lucide-react"
import { updateStore, type Store } from "@/api/storesApi"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const STATUS_LABELS: Record<Store["status"], string> = {
  ACTIVE: "Ativa",
  PENDING: "Pendente de aprovacao",
  BLOCKED: "Bloqueada",
}

interface MinhaLojaTabProps {
  store: Store
  onUpdated: (store: Store) => void
}

export default function MinhaLojaTab({ store, onUpdated }: MinhaLojaTabProps) {
  const [brand, setBrand] = useState(store.brand)
  const [description, setDescription] = useState(store.description ?? "")
  const [address, setAddress] = useState(store.contact?.address ?? "")
  const [phone, setPhone] = useState(store.contact?.phone ?? "")
  const [email, setEmail] = useState(store.contact?.email ?? "")
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!brand.trim()) {
      toast.error("Informe o nome da loja")
      return
    }
    setSaving(true)
    try {
      const updated = await updateStore(store.id, {
        brand: brand.trim(),
        description: description.trim() || undefined,
        contact: { address, phone, email },
      })
      onUpdated(updated)
      toast.success("Dados da loja atualizados")
    } catch {
      toast.error("Nao foi possivel atualizar a loja")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-none shadow-sm ring-1 ring-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <StoreIcon className="h-4 w-4 text-primary" />
          Minha loja
          <Badge variant={store.status === "ACTIVE" ? "secondary" : "outline"} className="ml-2">
            {STATUS_LABELS[store.status]}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Nome da loja</Label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Descricao</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Endereco</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Telefone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Email de contato</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex items-end sm:col-span-2">
          <Button disabled={saving} onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : "Salvar alteracoes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
