"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
      <div className="w-[90%]">
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
      <DropdownMenu className="w-[10%]">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {statusFilter === "all" ? "Lọc theo trạng thái" : statusFilter === "new" ? "Mới" : statusFilter === "incoming" ? "Sắp chiếu" : "Ngừng chiếu"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
            <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="new">Mới</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="incoming">Sắp chiếu</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="stop">Ngừng chiếu</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu className="w-[10%]">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            {tagFilter === "all" ? "Lọc theo nhãn" : tagFilter === "P" ? "P" : tagFilter === "K" ? "K" : tagFilter === "C13" ? "C13" : tagFilter === "C16" ? "C16" : tagFilter === "C18" ? "C18" : "Tất cả"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={tagFilter} onValueChange={setTagFilter}>
            <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="P">P</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="K">K</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="C13">C13</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="C16">C16</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="C18">C18</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
