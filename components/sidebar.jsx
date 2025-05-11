"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Film,
  Users,
  Calendar,
  Building2,
  BarChart4,
  Ticket,
  Settings,
  LogOut,
  Popcorn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Rạp phim",
    href: "/dashboard/cinemas",
    icon: Building2,
  },
  {
    title: "Phim",
    href: "/dashboard/movies",
    icon: Film,
  },
  {
    title: "Suất chiếu",
    href: "/dashboard/showtimes",
    icon: Calendar,
  },
  {
    title: "Combo",
    href: "/dashboard/combos",
    icon: Popcorn,
  },
  {
    title: "Người dùng",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Doanh thu",
    href: "/dashboard/revenue",
    icon: BarChart4,
  },
  {
    title: "Vé",
    href: "/dashboard/tickets",
    icon: Ticket,
  },
  {
    title: "Cài đặt",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const sidebarContent = (
    <>
      <div className="px-3 py-4">
        <div className="mb-8 flex items-center px-2">
          <h1 className="text-xl font-bold text-gray-800">Cinema Admin</h1>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.endsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                    isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-500")} />
                  {item.title}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )

  return (
    <div className="hidden h-full w-64 flex-col border-r bg-white md:flex">
      <div className="flex h-full flex-col">{sidebarContent}</div>
    </div>
  )
}
