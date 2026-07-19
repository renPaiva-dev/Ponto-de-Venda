import { Building2, LayoutGrid, Package, ShieldCheck, Tag, Users } from "lucide-react"
import { AppHeader } from "@/components/layout/AppHeader"
import { PageContainer } from "@/components/layout/PageContainer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LojasTab from "@/pages/admin/LojasTab"
import ProdutosTab from "@/pages/admin/ProdutosTab"
import CategoriasTab from "@/pages/admin/CategoriasTab"
import FuncionariosTab from "@/pages/admin/FuncionariosTab"
import ClientesTab from "@/pages/admin/ClientesTab"
import VisaoGeralTab from "@/pages/admin/VisaoGeralTab"

export default function AdminPanelPage() {
  return (
    <PageContainer>
      <AppHeader icon={ShieldCheck} title="Painel Administrativo da Rede" subtitle="Visao geral e gestao de todas as lojas" />

      <Tabs defaultValue="visao-geral">
        <TabsList className="flex-wrap">
          <TabsTrigger value="visao-geral" className="gap-1.5">
            <LayoutGrid className="h-4 w-4" />
            Visao geral
          </TabsTrigger>
          <TabsTrigger value="lojas" className="gap-1.5">
            <Building2 className="h-4 w-4" />
            Lojas
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
          <VisaoGeralTab />
        </TabsContent>
        <TabsContent value="lojas" className="mt-4">
          <LojasTab />
        </TabsContent>
        <TabsContent value="produtos" className="mt-4">
          <ProdutosTab />
        </TabsContent>
        <TabsContent value="categorias" className="mt-4">
          <CategoriasTab />
        </TabsContent>
        <TabsContent value="funcionarios" className="mt-4">
          <FuncionariosTab />
        </TabsContent>
        <TabsContent value="clientes" className="mt-4">
          <ClientesTab />
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
