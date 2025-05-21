"use client"

import { useState } from "react"
import { Bell, Search } from "lucide-react"
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

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white px-4 md:px-6">
      <div className="relative hidden w-72 md:block">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input type="search" placeholder="Tìm kiếm..." className="pl-8" />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <AuthButton />
      </div>
    </header>
  )
}
