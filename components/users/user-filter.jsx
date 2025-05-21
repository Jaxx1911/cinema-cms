"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UserFilter({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  searchInputRef,
}) {
  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
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
      <div className="w-[180px]">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="border-gray-200 bg-white">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="admin">Quản trị viên</SelectItem>
            <SelectItem value="customer">Người dùng</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 