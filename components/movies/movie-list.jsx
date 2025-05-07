"use client"

import { useGetMovies } from "@/hooks/use-movie"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, StopCircleIcon, Search, ChevronLeft, ChevronRight, Filter, PlayCircleIcon } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function MovieList({handleViewMovie, handleEditMovie, handleStopMovie, handleResumeMovie}) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const { data, isLoading, error, refetch } = useGetMovies(currentPage, itemsPerPage, searchTerm, statusFilter, tagFilter)
  useEffect(() => {
    console.log(searchTerm, statusFilter, tagFilter)
    refetch(currentPage, itemsPerPage, searchTerm, statusFilter, tagFilter)
  }, [currentPage, itemsPerPage, refetch, searchTerm, statusFilter, tagFilter])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const totalPages = Math.ceil(data.total_count / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }
  
  return (
    <>
      <div className="relative flex mb-4 gap-2">
        <div className="w-[90%]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
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
      <div className="rounded-md border">
        <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Poster</TableHead>
            <TableHead>Tên phim</TableHead>
            <TableHead>Thời lượng</TableHead>
            <TableHead>Thể loại</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-center">Ngày ra mắt</TableHead>
            <TableHead className="text-center">Tag</TableHead>
            <TableHead className="text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.data?.map((movie) => (
            <TableRow key={movie.id} className="hover:bg-gray-50">
              <TableCell>
                <div className="relative h-12 w-8 overflow-hidden rounded">
                  <Image
                    src={movie.poster_url || "/placeholder.svg?height=48&width=32"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium text-blue-600">{movie.title}</TableCell>
              <TableCell>{movie.duration} phút</TableCell>
              <TableCell>
                {movie.genres.map((genre) => (
                  <div key={genre} className="inline-flex items-center rounded-full px-2.5 py-0.5 mr-2 text-xs font-semibold bg-blue-100 text-blue-800">
                    {genre}
                  </div>
                ))}
              </TableCell>
              <TableCell className="text-center">
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    movie.status === "new"
                      ? "bg-green-100 text-green-800"
                      : movie.status === "incoming"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {movie.status === "new"
                    ? "Mới"
                    : movie.status === "incoming"
                    ? "Sắp ra mắt"
                    : "Ngừng chiếu"}
                </div>
              </TableCell>
              <TableCell className="text-center">{format(movie.release_date, "dd/MM/yyyy")}</TableCell>
              <TableCell className="text-center">
                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    movie.tag === 'P'
                      ? "bg-tag-p"
                      : movie.tag === 'K'
                      ? "bg-tag-k"
                      : movie.tag === 'C13'
                      ? "bg-tag-c13"
                      : movie.tag === 'C16'
                      ? "bg-tag-c16"
                      : movie.tag === 'C18'
                      ? "bg-tag-c18"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {movie.tag}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-blue-600"
                    onClick={() => handleViewMovie(movie)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Xem chi tiết</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-blue-600"
                    onClick={() => handleEditMovie(movie)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Chỉnh sửa</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => movie.status === "stop" ? handleResumeMovie(movie.id) : handleStopMovie(movie.id)}
                    className={`${movie.status === "stop" ? "text-green-600" : "text-red-600"}`}
                  >
                    {movie.status === "stop" ? (
                      <PlayCircleIcon className="h-4 w-4" />
                    ) : (
                      <StopCircleIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">Dừng chiếu</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-500">
        {data.data?.length > 0 ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, data.data.length)} của ${data.total_count} phim` : "Không có phim nào"}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Trang {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
    </>
  )
}


