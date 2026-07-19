import { Construction } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/app/hooks"
import { logout } from "@/features/auth/authSlice"
import { useNavigate } from "react-router-dom"

export default function ComingSoonPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-gradient-to-br from-muted/60 via-background to-muted/30 p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Painel em construcao</h1>
      <p className="max-w-md text-muted-foreground">
        O painel para o seu perfil ainda esta sendo implementado. Por enquanto, apenas o
        Terminal do Caixa, o Dashboard do Gerente e o Painel Administrativo estao disponiveis.
      </p>
      <Button
        onClick={() => {
          dispatch(logout())
          navigate("/login", { replace: true })
        }}
      >
        Voltar para o login
      </Button>
    </div>
  )
}
