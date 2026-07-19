import { useEffect, useState } from "react"
import { toast } from "sonner"
import { UserCog, UserPlus } from "lucide-react"
import { createEmployee, listEmployees, updateEmployee } from "@/api/employeesApi"
import { getAllStores, type Store } from "@/api/storesApi"
import type { User, UserRole } from "@/types"
import { ASSIGNABLE_ROLES, ROLE_LABELS, STORE_ASSIGNABLE_ROLES } from "@/lib/roles"

import { Badge } from "@/components/ui/badge"
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

const emptyForm = {
  fullName: "",
  email: "",
  password: "",
  role: "" as UserRole | "",
  storeId: "",
}

interface FuncionariosTabProps {
  restrictToStoreId?: number
}

export default function FuncionariosTab({ restrictToStoreId }: FuncionariosTabProps) {
  const [employees, setEmployees] = useState<User[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const roleOptions = restrictToStoreId ? STORE_ASSIGNABLE_ROLES : ASSIGNABLE_ROLES

  async function loadAll() {
    setLoading(true)
    try {
      const [employeesData, storesData] = await Promise.all([
        listEmployees(),
        restrictToStoreId ? Promise.resolve([]) : getAllStores(),
      ])
      setEmployees(employeesData)
      setStores(storesData)
    } catch {
      toast.error("Nao foi possivel carregar os funcionarios")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreate() {
    if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.role) {
      toast.error("Preencha nome, email, senha e papel")
      return
    }
    setCreating(true)
    try {
      await createEmployee({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        storeId: restrictToStoreId ?? (form.storeId ? Number(form.storeId) : undefined),
      })
      setForm(emptyForm)
      toast.success("Funcionario criado")
      await loadAll()
    } catch {
      toast.error("Nao foi possivel criar o funcionario")
    } finally {
      setCreating(false)
    }
  }

  async function handleRoleChange(employeeId: number, role: UserRole) {
    try {
      await updateEmployee(employeeId, { role })
      toast.success("Papel atualizado")
      await loadAll()
    } catch {
      toast.error("Nao foi possivel atualizar o papel")
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4 text-primary" />
            Novo funcionario
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Nome</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Senha</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Papel</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v as UserRole })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <div className="flex items-end">
            <Button disabled={creating} onClick={handleCreate} className="w-full">
              {creating ? "Criando..." : "Criar funcionario"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm ring-1 ring-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCog className="h-4 w-4 text-primary" />
            Funcionarios
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
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.fullName}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      {restrictToStoreId && !roleOptions.includes(employee.role) ? (
                        <Badge variant="secondary">{ROLE_LABELS[employee.role]}</Badge>
                      ) : (
                        <Select
                          value={employee.role}
                          onValueChange={(v) => handleRoleChange(employee.id, v as UserRole)}
                        >
                          <SelectTrigger className="w-56">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roleOptions.map((role) => (
                              <SelectItem key={role} value={role}>
                                {ROLE_LABELS[role]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Nenhum funcionario cadastrado
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
