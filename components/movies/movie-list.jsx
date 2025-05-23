"use client"

import { useGetMovies } from "@/hooks/use-movie"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, StopCircleIcon, ChevronLeft, ChevronRight, PlayCircleIcon } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { useState, useEffect } from "react"

export default function MovieList({
  handleViewMovie, 
  handleEditMovie, 
  handleStopMovie, 
  handleResumeMovie,  
  statusFilter,
  tagFilter,
  searchInputRef,
  debouncedSearchTerm,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const { data, isLoading, error, refetch } = useGetMovies(currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, tagFilter)

  useEffect(() => {
    refetch(currentPage, itemsPerPage, debouncedSearchTerm, statusFilter, tagFilter)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [currentPage, itemsPerPage, refetch, debouncedSearchTerm, statusFilter, tagFilter])

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
                    ? "Sắp chiếu"
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


