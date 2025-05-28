"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InvoiceFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  searchInputRef
}) {
  return (
    <div className="relative flex mb-4 gap-2">
      <div className="w-[90%]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Tìm kiếm mã giao dịch, khách hàng..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-[10%]">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="success">Thành công</SelectItem>
            <SelectItem value="failed">Thất bại</SelectItem>
            <SelectItem value="pending">Đang xử lý</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 