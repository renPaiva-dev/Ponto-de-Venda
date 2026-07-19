import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className="min-h-svh bg-gradient-to-br from-muted/60 via-background to-muted/30 p-4 sm:p-6">
      <div className={cn("mx-auto flex max-w-6xl flex-col gap-5", className)}>{children}</div>
    </div>
  )
}
