"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function UserFilter({ searchTerm, setSearchTerm, searchInputRef }) {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        ref={searchInputRef}
        type="search"
        placeholder="Tìm kiếm người dùng..."
        className="pl-9"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
} 