"use client"

import { useState, useEffect, useRef } from "react"
import { CalendarIcon, X, Plus, Tag, Film, Clock, User, Users, FileVideo, FileText, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { useGetGenres } from "@/hooks/use-genre"
import { useGetMovieById } from "@/hooks/use-movie"
// Mock data for tags and genres
const movieTags = ["P", "K", "C13", "C16", "C18"]

export function MovieDialog({ isOpen, onClose, movie, mode = "view", onSave, setDialogMode, setIsMovieDialogOpen }) {
  const { data: genres, isLoading: genresLoading, error: genresError } = useGetGenres()
  const { data: movieDetails, isLoading: movieDetailsLoading, error: movieDetailsError } = useGetMovieById(movie?.id)

  const isViewMode = mode === "view"
  const isEditMode = mode === "edit"
  const isAddMode = mode === "add"

  const posterFileRef = useRef(null)
  const bannerFileRef = useRef(null)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    directors: [],
    casters: [],
    releaseDate: "",
    trailerUrl: "",
    tag: "",
    genres: [],
    status: "new",
    posterUrl: "",
    bannerUrl: "",
  })

  const [date, setDate] = useState()
  const [newDirector, setNewDirector] = useState("")
  const [newCaster, setNewCaster] = useState("")
  const [posterPreview, setPosterPreview] = useState("")
  const [bannerPreview, setBannerPreview] = useState("")
  const [posterDimensions, setPosterDimensions] = useState({ width: 0, height: 0 })
  const [bannerDimensions, setBannerDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (movie && (isViewMode || isEditMode)) {
      // Convert string arrays to arrays if they're not already
      const directors = movieDetails?.director.split(",") || []
      const casters = movieDetails?.caster.split(",") || []
      const genres = Array.isArray(movieDetails?.genres) ? movieDetails?.genres : movieDetails?.genre ? movieDetails?.genre.split(", ") : []
      
      console.log(directors)
      console.log(casters)
      console.log(genres)
      
      setFormData({
        ...movie,
        duration: movie.duration.toString(),
        directors,
        casters,
        trailerUrl: movie.trailer_url,
        status: movie.status,
        genres,
      })

      if (movie.release_date) {
        setDate(new Date(movie.release_date))
      }

      // Set poster preview and dimensions
      if (movie.poster_url) {
        const img = new Image()
        img.onload = () => {
          setPosterDimensions({ width: img.width, height: img.height })
        }
        img.src = movie.poster_url
        setPosterPreview(movie.poster_url)
      }

      // Set banner preview and dimensions
      if (movie.large_poster_url) {
        const img = new Image()
        img.onload = () => {
          setBannerDimensions({ width: img.width, height: img.height })
        }
        img.src = movie.large_poster_url
        setBannerPreview(movie.large_poster_url)
      }
    }
  }, [movie, isViewMode, isEditMode, movieDetails])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiSelectChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = prev[name] || []
      if (currentValues.includes(value)) {
        return { ...prev, [name]: currentValues.filter((item) => item !== value) }
      } else {
        return { ...prev, [name]: [...currentValues, value] }
      }
    })
  }

  const handleDateChange = (newDate) => {
    setDate(newDate)
    setFormData((prev) => ({
      ...prev,
      releaseDate: newDate ? format(newDate, "yyyy-MM-dd") : "",
    }))
  }

  const addDirector = () => {
    if (newDirector.trim()) {
      setFormData((prev) => ({
        ...prev,
        directors: [...prev.directors, newDirector.trim()],
      }))
      setNewDirector("")
    }
  }

  const removeDirector = (director) => {
    setFormData((prev) => ({
      ...prev,
      directors: prev.directors.filter((d) => d !== director),
    }))
  }

  const addCaster = () => {
    if (newCaster.trim()) {
      setFormData((prev) => ({
        ...prev,
        casters: [...prev.casters, newCaster.trim()],
      }))
      setNewCaster("")
    }
  }

  const removeCaster = (caster) => {
    setFormData((prev) => ({
      ...prev,
      casters: prev.casters.filter((c) => c !== caster),
    }))
  }

  const handlePosterChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          setPosterDimensions({ width: img.width, height: img.height })
        }
        img.src = reader.result
        setPosterPreview(reader.result)
        setFormData((prev) => ({ ...prev, posterUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          setBannerDimensions({ width: img.width, height: img.height })
        }
        img.src = reader.result
        setBannerPreview(reader.result)
        setFormData((prev) => ({ ...prev, bannerUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Convert arrays to strings for backend compatibility if needed
    const processedData = {
      ...formData,
      duration: Number.parseInt(formData.duration, 10),
      director: formData.directors.join(", "),
      cast: formData.casters.join(", "),
      genre: formData.genres.join(", "),
    }

    onSave(processedData)
    onClose()
  }

  const dialogTitle = isAddMode ? "Thêm phim mới" : isEditMode ? "Chỉnh sửa phim" : "Chi tiết phim"

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-none">
        <DialogHeader>
          <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
          {!isViewMode && (
            <DialogDescription>
              {isAddMode ? "Nhập thông tin chi tiết về phim mới" : "Chỉnh sửa thông tin phim"}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Banner Preview */}
            <div className="space-y-2 w-full">
              <Label htmlFor="bannerUpload" className="flex items-center gap-2 text-lg font-medium">
                Banner
              </Label>
              <div className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                {bannerPreview ? (
                  <img
                    src={bannerPreview || "/placeholder.svg"}
                    alt="Movie banner preview"
                    style={{
                      width: bannerDimensions.width > 1980 ? "1980px" : `${bannerDimensions.width}px`,
                      height: "auto",
                    }}
                  />
                ) : (
                  <div className="w-full min-h-[200px] text-center p-4 text-gray-400 flex flex-col items-center justify-center">
                    <Film className="h-10 w-10 mx-auto mb-2" />
                    <p>Chưa có banner</p>
                  </div>
                )}
              </div>
              {!isViewMode ? (
                <div>
                  <input
                    ref={bannerFileRef}
                    type="file"
                    id="bannerUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => bannerFileRef.current?.click()}
                    className="mt-2"
                  >
                    Chọn banner
                  </Button>
                </div>
              ) : null}
            </div>

            {/* Two column layout for poster and form fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Poster Preview */}
              <div className="flex flex-col items-center gap-4">
                <Label htmlFor="posterUpload" className="flex items-start gap-2 text-lg font-medium">
                  Poster
                </Label>
                <div className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
                  {posterPreview ? (
                    <img
                      src={posterPreview || "/placeholder.svg"}
                      alt="Movie poster preview"
                      style={{
                        width: posterDimensions.width > 300 ? "300px" : `${posterDimensions.width}px`,
                        height: "auto",
                      }}
                    />
                  ) : (
                    <div className="w-full min-h-[200px] text-center p-4 text-gray-400 flex flex-col items-center justify-center">
                      <Film className="h-10 w-10 mx-auto mb-2" />
                      <p>Chưa có poster</p>
                    </div>
                  )}
                </div>
                {!isViewMode ? (
                  <div>
                    <input
                      ref={posterFileRef}
                      type="file"
                      id="posterUpload"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePosterChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => posterFileRef.current?.click()}
                      className="w-full"
                    >
                      Chọn poster
                    </Button>
                  </div>
                ) : null}
              </div>

              {/* Form Fields - 50% width on desktop */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Film className="h-4 w-4" /> Tên phim
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    disabled={isViewMode}
                    required
                    placeholder="Nhập tên phim"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> Thời lượng (phút)
                  </Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    disabled={isViewMode}
                    required
                    placeholder="Nhập thời lượng phim"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="releaseDate" className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" /> Ngày khởi chiếu
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        disabled={isViewMode}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trailerUrl" className="flex items-center gap-2">
                    <FileVideo className="h-4 w-4" /> URL Trailer
                  </Label>
                  <Input
                    id="trailerUrl"
                    name="trailerUrl"
                    value={formData.trailerUrl}
                    onChange={handleChange}
                    disabled={isViewMode}
                    placeholder="Nhập URL trailer (YouTube, Vimeo...)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Tag
                    </Label>
                    <Select
                      value={formData.tag}
                      onValueChange={(value) => handleSelectChange("tag", value)}
                      disabled={isViewMode}
                    >
                      <SelectTrigger id="tag">
                        <SelectValue placeholder="Chọn tag" />
                      </SelectTrigger>
                      <SelectContent>
                        {movieTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Trạng thái
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                      disabled={isViewMode}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Đang chiếu</SelectItem>
                        <SelectItem value="incoming">Sắp chiếu</SelectItem>
                        <SelectItem value="hidden">Ngừng chiếu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Thể loại
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 border rounded-md">
                    {genres.map((genre) => (
                      <Badge
                        key={genre.id}
                        variant={formData.genres.includes(genre.name) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer",
                          formData.genres.includes(genre.name)
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-transparent text-gray-700 hover:bg-gray-100",
                        )}
                        onClick={() => !isViewMode && handleMultiSelectChange("genres", genre.name)}
                      >
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                  {formData.genres.length > 0 && (
                    <div className="text-sm text-gray-500">Đã chọn: {formData.genres.join(", ")}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Full width fields below */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isViewMode}
                rows={3}
                placeholder="Nhập mô tả phim"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="directors" className="flex items-center gap-2">
                <User className="h-4 w-4" /> Đạo diễn
              </Label>
              {!isViewMode ? (
                <div className="flex gap-2">
                  <Input
                    id="newDirector"
                    value={newDirector}
                    onChange={(e) => setNewDirector(e.target.value)}
                    placeholder="Nhập tên đạo diễn"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addDirector} disabled={!newDirector.trim()} variant="outline">
                    <Plus className="h-4 w-4 mr-1" /> Thêm
                  </Button>
                </div>
              ) : null}
              {formData.directors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.directors.map((director, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {director}
                      {!isViewMode && <X className="h-3 w-3 cursor-pointer" onClick={() => removeDirector(director)} />}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="casters" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Diễn viên
              </Label>
              {!isViewMode ? (
                <div className="flex gap-2">
                  <Input
                    id="newCaster"
                    value={newCaster}
                    onChange={(e) => setNewCaster(e.target.value)}
                    placeholder="Nhập tên diễn viên"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addCaster} disabled={!newCaster.trim()} variant="outline">
                    <Plus className="h-4 w-4 mr-1" /> Thêm
                  </Button>
                </div>
              ) : null}
              {formData.casters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.casters.map((caster, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {caster}
                      {!isViewMode && <X className="h-3 w-3 cursor-pointer" onClick={() => removeCaster(caster)} />}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {!isViewMode && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isAddMode ? "Thêm phim" : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          )}

          {isViewMode && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  // Switch to edit mode
                  onClose()
                  // Small delay to ensure dialog closes properly before reopening in edit mode
                  setTimeout(() => {
                    setDialogMode("edit")
                    setIsMovieDialogOpen(true)
                  }, 100)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button type="button" onClick={onClose}>
                Đóng
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
