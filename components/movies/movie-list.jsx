"use client"

import { useGetMovies } from "@/hooks/use-movie"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Search } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function MovieList({handleViewMovie, handleEditMovie, handleDeleteClick}) {
  const { data, isLoading, error } = useGetMovies()
  const [searchTerm, setSearchTerm] = useState("")

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }
  
  return (
    <>
      <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Tìm kiếm phim..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
          {data.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase())).map((movie) => (
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
                    onClick={() => handleDeleteClick(movie.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Xóa</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </>
  )
}


