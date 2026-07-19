import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { LogOut, User as UserIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { logout } from "@/features/auth/authSlice"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ROLE_LABELS } from "@/lib/roles"

interface AppHeaderProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  actions?: ReactNode
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function AppHeader({ icon: Icon, title, subtitle, actions }: AppHeaderProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  function handleLogout() {
    dispatch(logout())
    navigate("/login", { replace: true })
  }

  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-tight sm:text-xl">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm outline-none transition hover:bg-accent">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                {user ? initials(user.fullName) : <UserIcon className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-32 truncate font-medium sm:inline">
              {user?.fullName}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="font-medium">{user?.fullName}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">
                {user?.email}
              </span>
              {user && (
                <Badge variant="secondary" className="mt-1 w-fit text-xs">
                  {ROLE_LABELS[user.role]}
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
