"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MovieDialog } from "@/components/movies/movie-dialog"
import MovieList from "@/components/movies/movie-list"

export default function MoviesPage() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [movieToDelete, setMovieToDelete] = useState(null)
  const [movies, setMovies] = useState()

  // Movie dialog state
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [dialogMode, setDialogMode] = useState("view") // view, edit, add

  const filteredMovies = movies?.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleDeleteClick = (id) => {
    setMovieToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setMovies(movies?.filter((movie) => movie.id !== movieToDelete))
    setIsDeleteDialogOpen(false)
    setMovieToDelete(null)
  }

  const handleViewMovie = (movie) => {
    console.log(movie)
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
        <MovieList handleViewMovie={handleViewMovie} handleEditMovie={handleEditMovie} handleDeleteClick={handleDeleteClick} setMovies={setMovies}/>
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
