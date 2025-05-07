"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Search, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { useCreateMovie, useUpdateMovie, useStopMovie, useResumeMovie } from "@/hooks/use-movie"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import MovieFilter from "@/components/movies/movie-filter"

export default function MoviesPage() {
  const { toast } = useToast()
  const { mutate, data, isLoading, error } = useCreateMovie()
  const { mutate: updateMovie, data: updateData, isLoading: updateLoading, error: updateError } = useUpdateMovie()
  const { mutate: stopMovie, data: stopData, isLoading: stopLoading, error: stopError } = useStopMovie()
  const { mutate: resumeMovie, data: resumeData, isLoading: resumeLoading, error: resumeError } = useResumeMovie()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tagFilter, setTagFilter] = useState("all")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const searchInputRef = useRef(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [movieToDelete, setMovieToDelete] = useState(null)
  const [movies, setMovies] = useState()

  // Movie dialog state
  const [isMovieDialogOpen, setIsMovieDialogOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [dialogMode, setDialogMode] = useState("view") // view, edit, add

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleStopMovie = (id) => {
    setMovieToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleResumeMovie = (id) => {
    resumeMovie(id, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Thiết lập phim thành công",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        })
      },
      onError: (error) => {
        toast({
          title: "Lỗi",
          description: error.message || "Có lỗi xảy ra khi thiết lập phim",
        })
      }
    })
    setIsDeleteDialogOpen(false)
  }
  const handleStopConfirm = () => {
    stopMovie(movieToDelete, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Dừng chiếu phim thành công",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        })
      },
      onError: (error) => {
        toast({
          title: "Lỗi",
          description: error.message || "Có lỗi xảy ra khi dừng chiếu phim",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        })
      }
    })
    setIsDeleteDialogOpen(false)
  }

  const handleViewMovie = (movie) => {
    console.log(movie)
    setSelectedMovie(movie)
    setDialogMode("view")
    setIsMovieDialogOpen(true)
  }

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
      const formData = new FormData()
      formData.append("title", movieData.title)
      formData.append("description", movieData.description)
      formData.append("duration", movieData.duration)
      movieData.genre.forEach((genre) => {
        formData.append("genres", genre)
      })
      movieData.directors.forEach((director) => {
        formData.append("director", director)
      })
      movieData.cast.forEach((caster) => {
        formData.append("caster", caster)
      })
      formData.append("poster_image", movieData.poster)
      formData.append("large_poster_image", movieData.banner)
      formData.append("trailer_url", movieData.trailerUrl)
      formData.append("status", movieData.status)
      formData.append("release_date", format(movieData.releaseDate, "dd-MM-yyyy"))
      formData.append("tag", movieData.tag)

      mutate(formData, {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Thêm phim mới thành công",
            variant: "default",
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          })
          setIsMovieDialogOpen(false)
        },
        onError: (error) => {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi thêm phim",
            variant: "destructive",
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          })
        }
      })
      if (data) {
        setMovies([...movies, data])
      }
    } else if (dialogMode === "edit") {
      const formData = new FormData()
      formData.append("title", movieData.title)
      formData.append("description", movieData.description)
      formData.append("duration", movieData.duration)
      movieData.genre.forEach((genre) => {
        formData.append("genres", genre)
      })
      movieData.directors.forEach((director) => {
        formData.append("director", director)
      })
      movieData.cast.forEach((caster) => {
        formData.append("caster", caster)
      })
      if (movieData.poster) {
        formData.append("poster_image", movieData.poster)
      }
      if (movieData.banner) {
        formData.append("large_poster_image", movieData.banner)
      }
      formData.append("trailer_url", movieData.trailerUrl)
      formData.append("status", movieData.status)
      formData.append("release_date", format(new Date(movieData.releaseDate? movieData.releaseDate : movieData.release_date), "dd-MM-yyyy"))
      formData.append("tag", movieData.tag)
      
      updateMovie({ id: movieData.id, formData }, {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Cập nhật phim thành công",
            variant: "default",
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          })
          setIsMovieDialogOpen(false)
        },
        onError: (error) => {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi cập nhật phim",
            variant: "destructive",
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          })
        }
      })
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
        <MovieFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          tagFilter={tagFilter}
          setTagFilter={setTagFilter}
          searchInputRef={searchInputRef}
        />
        <MovieList 
          handleViewMovie={handleViewMovie} 
          handleEditMovie={handleEditMovie} 
          handleStopMovie={handleStopMovie} 
          handleResumeMovie={handleResumeMovie} 
          setMovies={setMovies}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          tagFilter={tagFilter}
          searchInputRef={searchInputRef}
          debouncedSearchTerm={debouncedSearchTerm}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận dừng chiếu</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn dừng chiếu phim này?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleStopConfirm}>
              Dừng chiếu
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
