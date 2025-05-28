"use client"

import { useState } from "react"
import { Bell, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { AuthButton } from "@/components/auth/auth-button"
import { useAcceptAllPayments } from "@/hooks/use-payment"

export function Header() {
  const { mutate: onClose } = useAcceptAllPayments()
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
      <Button variant="outline" size="icon" className="border-none" onClick={() => onClose()}>
      </Button>
      <div className="ml-auto flex items-center gap-4">
        <AuthButton />
      </div>
    </header>
  )
}
