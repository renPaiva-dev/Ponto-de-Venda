import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { LayoutGrid, Package, ShoppingCart, Store as StoreIcon, Tag, Users } from "lucide-react"
import { createStore, getMyStore, type Store } from "@/api/storesApi"
import { useAppDispatch } from "@/app/hooks"
import { logout } from "@/features/auth/authSlice"
import { AppHeader } from "@/components/layout/AppHeader"
import { PageContainer } from "@/components/layout/PageContainer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProdutosTab from "@/pages/admin/ProdutosTab"
import CategoriasTab from "@/pages/admin/CategoriasTab"
import FuncionariosTab from "@/pages/admin/FuncionariosTab"
import ClientesTab from "@/pages/admin/ClientesTab"
import MinhaLojaTab from "@/pages/loja/MinhaLojaTab"
import VisaoGeralLojaTab from "@/pages/loja/VisaoGeralLojaTab"

function CreateStoreOnboarding({ onCreated }: { onCreated: (store: Store) => void }) {
  const [brand, setBrand] = useState("")
  const [creating, setCreating] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function handleLogout() {
    dispatch(logout())
    navigate("/login", { replace: true })
  }

  async function handleCreate() {
    if (!brand.trim()) {
      toast.error("Informe o nome da sua loja")
      return
    }
    setCreating(true)
    try {
      const store = await createStore(brand.trim())
      toast.success("Loja criada com sucesso")
      onCreated(store)
    } catch {
      toast.error("Nao foi possivel criar a loja")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-muted/60 via-background to-muted/30 p-4">
      <Card className="w-full max-w-sm border-none shadow-lg ring-1 ring-border/60">
        <CardHeader className="items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <StoreIcon className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Vamos criar sua loja</CardTitle>
          <CardDescription>Voce ainda nao tem uma loja cadastrada</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="brand">Nome da loja</Label>
            <Input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <Button disabled={creating} onClick={handleCreate}>
            {creating ? "Criando..." : "Criar minha loja"}
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function StoreAdminPanelPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getMyStore()
      .then(setStore)
      .catch(() => toast.error("Nao foi possivel carregar sua loja"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <PageContainer>
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </PageContainer>
    )
  }

  if (!store) {
    return <CreateStoreOnboarding onCreated={setStore} />
  }

  return (
    <PageContainer>
      <AppHeader
        icon={StoreIcon}
        title="Painel da Loja"
        subtitle={store.brand}
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => navigate("/caixa")}>
            <ShoppingCart className="h-4 w-4" />
            Vender
          </Button>
        }
      />

      <Tabs defaultValue="visao-geral">
        <TabsList className="flex-wrap">
          <TabsTrigger value="visao-geral" className="gap-1.5">
            <LayoutGrid className="h-4 w-4" />
            Visao geral
          </TabsTrigger>
          <TabsTrigger value="minha-loja" className="gap-1.5">
            <StoreIcon className="h-4 w-4" />
            Minha loja
          </TabsTrigger>
          <TabsTrigger value="produtos" className="gap-1.5">
            <Package className="h-4 w-4" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="categorias" className="gap-1.5">
            <Tag className="h-4 w-4" />
            Categorias
          </TabsTrigger>
          <TabsTrigger value="funcionarios" className="gap-1.5">
            <Users className="h-4 w-4" />
            Funcionarios
          </TabsTrigger>
          <TabsTrigger value="clientes" className="gap-1.5">
            <Users className="h-4 w-4" />
            Clientes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="visao-geral" className="mt-4">
          <VisaoGeralLojaTab />
        </TabsContent>
        <TabsContent value="minha-loja" className="mt-4">
          <MinhaLojaTab store={store} onUpdated={setStore} />
        </TabsContent>
        <TabsContent value="produtos" className="mt-4">
          <ProdutosTab restrictToStoreId={store.id} />
        </TabsContent>
        <TabsContent value="categorias" className="mt-4">
          <CategoriasTab />
        </TabsContent>
        <TabsContent value="funcionarios" className="mt-4">
          <FuncionariosTab restrictToStoreId={store.id} />
        </TabsContent>
        <TabsContent value="clientes" className="mt-4">
          <ClientesTab />
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
