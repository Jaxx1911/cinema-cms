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
  ChevronDown,
  ChevronRight,
  Popcorn,
  HandCoins,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
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
    title: "Combo",
    href: "/dashboard/combos",
    icon: Popcorn,
  },
  {
    title: "Phiếu giảm giá",
    href: "/dashboard/discounts",
    icon: HandCoins,
  },
  {
    title: "Người dùng",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Thống kê",
    icon: BarChart4,
    submenu: [
      {
        title: "Doanh thu theo phim",
        href: "/dashboard/revenue/by-movie",
      },
      {
        title: "Doanh thu theo rạp",
        href: "/dashboard/revenue/by-cinema",
      },
      {
        title: "Combo bắp nước",
        href: "/dashboard/revenue/combo",
      },
    ],
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
  const [openSubmenu, setOpenSubmenu] = useState(null)

  useEffect(() => {
    navItems.forEach((item, index) => {
      if (
        item.submenu &&
        item.submenu.some((subItem) => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`))
      ) {
        setOpenSubmenu(index)
      }
    })
  }, [pathname])

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index)
  }
  const sidebarContent = (
    <>
      <div className="px-3 py-4">
        <div className="mb-8 flex items-center px-2">
          <h1 className="text-xl font-bold text-gray-800">Cinema Admin</h1>
        </div>
        <div className="space-y-1">
        {navItems.map((item, index) => {
            const isActive = item.href
              ? pathname === item.href || pathname.endsWith(`${item.href}/`)
              : item.submenu &&
                item.submenu.some((subItem) => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`))

            const isSubmenuOpen = openSubmenu === index

            return (
              <div key={index}>
                {item.href ? (
                  <Link href={item.href}>
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
                ) : (
                  <div>
                    <div
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all cursor-pointer",
                        isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      )}
                      onClick={() => toggleSubmenu(index)}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-500")} />
                        {item.title}
                      </div>
                      {isSubmenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    {isSubmenuOpen && item.submenu && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem, subIndex) => {
                          const isSubActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                          return (
                            <Link key={subIndex} href={subItem.href}>
                              <div
                                className={cn(
                                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all",
                                  isSubActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                )}
                              >
                                {subItem.title}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
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
