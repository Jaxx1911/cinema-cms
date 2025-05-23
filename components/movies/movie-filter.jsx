"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MovieFilter({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter,
  tagFilter,
  setTagFilter,
  searchInputRef 
}) {
  return (
    <div className="relative flex mb-4 gap-2">
      <div className="w-[70%]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Tìm kiếm phim..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-[15%]">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="new">Mới</SelectItem>
            <SelectItem value="incoming">Sắp chiếu</SelectItem>
            <SelectItem value="stop">Ngừng chiếu</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-[15%]">
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Lọc theo nhãn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="P">P</SelectItem>
            <SelectItem value="K">K</SelectItem>
            <SelectItem value="C13">C13</SelectItem>
            <SelectItem value="C16">C16</SelectItem>
            <SelectItem value="C18">C18</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
