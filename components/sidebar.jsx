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
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

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
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sidebarContent = (
    <>
      <div className="px-3 py-4">
        <div className="mb-8 flex items-center px-2">
          <h1 className="text-xl font-bold text-gray-800">Cinema Admin</h1>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link key={item.href} href={item.href} onClick={() => isMobile && setIsOpen(false)}>
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
      <div className="mt-auto border-t px-3 py-4">
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900">
          <LogOut className="mr-2 h-5 w-5" />
          Đăng xuất
        </Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <>
        <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        {isOpen && <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsOpen(false)} />}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-200 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h1 className="text-xl font-bold text-gray-800">Cinema Admin</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {sidebarContent}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="hidden h-full w-64 flex-col border-r bg-white md:flex">
      <div className="flex h-full flex-col">{sidebarContent}</div>
    </div>
  )
}
