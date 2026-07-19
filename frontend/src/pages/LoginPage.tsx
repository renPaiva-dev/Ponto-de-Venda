import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { ShoppingBag } from "lucide-react"
import { login } from "@/api/authApi"
import { useAppDispatch } from "@/app/hooks"
import { setCredentials } from "@/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ROLE_HOME_ROUTE: Record<string, string> = {
  ROLE_CASHIER: "/caixa",
  ROLE_BRANCH_MANAGER: "/gerente",
  ROLE_STORE_MANAGER: "/gerente",
  ROLE_ADMIN: "/admin",
  ROLE_STORE_ADMIN: "/loja",
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await login(email, password)
      dispatch(setCredentials({ user: response.user, jwt: response.jwt }))
      navigate(ROLE_HOME_ROUTE[response.user.role] ?? "/em-breve", { replace: true })
    } catch {
      toast.error("Email ou senha invalidos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-gradient-to-br from-muted/60 via-background to-muted/30 p-4">
      <Card className="w-full max-w-sm border-none shadow-lg ring-1 ring-border/60">
        <CardHeader className="items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Sistema de Ponto de Venda</CardTitle>
          <CardDescription>Entre com suas credenciais para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Ainda nao tem uma loja cadastrada?{" "}
              <Link to="/cadastro" className="font-medium text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
