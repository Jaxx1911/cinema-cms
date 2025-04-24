"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { mockMovies } from "@/lib/mock-data"
import { MovieDialog } from "@/components/movies/movie-dialog"

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [movieToDelete, setMovieToDelete] = useState(null)
  const [movies, setMovies] = useState(mockMovies)

  // Movie dialog state
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [dialogMode, setDialogMode] = useState("view") // view, edit, add

  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDeleteClick = (id) => {
    setMovieToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setMovies(movies.filter((movie) => movie.id !== movieToDelete))
    setIsDeleteDialogOpen(false)
    setMovieToDelete(null)
  }

  const handleViewMovie = (movie) => {
    setSelectedMovie(movie)
    setDialogMode("view")
    setIsMovieDialogOpen(true)
  }

  // Function to switch to edit mode from view mode
  const switchToEditMode = () => {
    setDialogMode("edit")
    setIsMovieDialogOpen(true)
  }

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie)
    setDialogMode("edit")
    setIsMovieDialogOpen(true)
  }

  const handleAddMovie = () => {
    setSelectedMovie(null)
    setDialogMode("add")
    setIsMovieDialogOpen(true)
  }

  const handleSaveMovie = (movieData) => {
    if (dialogMode === "add") {
      // Add new movie with a new ID
      const newMovie = {
        ...movieData,
        id: Math.max(...movies.map((m) => m.id)) + 1,
        // Ensure these fields are arrays even if they come as strings
        directors: Array.isArray(movieData.directors)
          ? movieData.directors
          : movieData.director
            ? movieData.director.split(", ")
            : [],
        casters: Array.isArray(movieData.casters)
          ? movieData.casters
          : movieData.cast
            ? movieData.cast.split(", ")
            : [],
        genres: Array.isArray(movieData.genres) ? movieData.genres : movieData.genre ? movieData.genre.split(", ") : [],
      }
      setMovies([...movies, newMovie])
    } else if (dialogMode === "edit") {
      // Update existing movie
      setMovies(
        movies.map((movie) =>
          movie.id === movieData.id
            ? {
                ...movieData,
                // Ensure these fields are arrays even if they come as strings
                directors: Array.isArray(movieData.directors)
                  ? movieData.directors
                  : movieData.director
                    ? movieData.director.split(", ")
                    : [],
                casters: Array.isArray(movieData.casters)
                  ? movieData.casters
                  : movieData.cast
                    ? movieData.cast.split(", ")
                    : [],
                genres: Array.isArray(movieData.genres)
                  ? movieData.genres
                  : movieData.genre
                    ? movieData.genre.split(", ")
                    : [],
              }
            : movie,
        ),
      )
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý phim</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddMovie}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm phim
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
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
                <TableHead>ID</TableHead>
                <TableHead>Poster</TableHead>
                <TableHead>Tên phim</TableHead>
                <TableHead>Thời lượng</TableHead>
                <TableHead>Thể loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovies.map((movie) => (
                <TableRow key={movie.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{movie.id}</TableCell>
                  <TableCell>
                    <div className="relative h-12 w-8 overflow-hidden rounded">
                      <Image
                        src={movie.posterUrl || "/placeholder.svg?height=48&width=32"}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">{movie.title}</TableCell>
                  <TableCell>{movie.duration} phút</TableCell>
                  <TableCell>{movie.genre}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        movie.status === "showing"
                          ? "bg-green-100 text-green-800"
                          : movie.status === "coming_soon"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {movie.status === "showing"
                        ? "Đang chiếu"
                        : movie.status === "coming_soon"
                          ? "Sắp chiếu"
                          : "Ngừng chiếu"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa phim này? Hành động này không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movie Dialog for View/Edit/Add */}
      <MovieDialog
        isOpen={isMovieDialogOpen}
        onClose={() => setIsMovieDialogOpen(false)}
        movie={selectedMovie}
        mode={dialogMode}
        onSave={handleSaveMovie}
        setDialogMode={setDialogMode}
        setIsMovieDialogOpen={setIsMovieDialogOpen}
      />
    </div>
  )
}
