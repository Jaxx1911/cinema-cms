"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock, X } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format, addMinutes, parse } from "date-fns"
import { vi } from "date-fns/locale"
import { mockCinemas, mockScreens, mockMovies } from "@/lib/mock-data"

export function ShowtimeDialog({ isOpen, onClose, showtime, mode = "view", onSave }) {
  const isViewMode = mode === "view"
  const isEditMode = mode === "edit"
  const isAddMode = mode === "add"

  const [formData, setFormData] = useState({
    movieId: "",
    cinemaId: "",
    screenId: "",
    date: "",
    startTime: "",
    price: "",
    availableSeats: "",
  })

  const [date, setDate] = useState()
  const [availableScreens, setAvailableScreens] = useState([])
  const [selectedMovie, setSelectedMovie] = useState(null)

  useEffect(() => {
    if (showtime && (isViewMode || isEditMode)) {
      const startDateTime = new Date(showtime.startTime)

      setFormData({
        movieId: showtime.movieId.toString(),
        cinemaId: showtime.cinemaId.toString(),
        screenId: showtime.screenId.toString(),
        date: format(startDateTime, "yyyy-MM-dd"),
        startTime: format(startDateTime, "HH:mm"),
        price: showtime.price.toString(),
        availableSeats: showtime.availableSeats.toString(),
      })

      setDate(startDateTime)

      // Update available screens based on selected cinema
      if (showtime.cinemaId) {
        const screens = mockScreens.filter((screen) => screen.cinemaId === showtime.cinemaId)
        setAvailableScreens(screens)
      }

      // Set selected movie
      const movie = mockMovies.find((m) => m.id === showtime.movieId)
      setSelectedMovie(movie)
    }
  }, [showtime, isViewMode, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "cinemaId") {
      // Update available screens when cinema changes
      const screens = mockScreens.filter((screen) => screen.cinemaId === Number.parseInt(value))
      setAvailableScreens(screens)

      // Reset screen selection
      setFormData((prev) => ({ ...prev, screenId: "" }))
    }

    if (name === "movieId") {
      const movie = mockMovies.find((m) => m.id === Number.parseInt(value))
      setSelectedMovie(movie)
    }
  }

  const handleDateChange = (newDate) => {
    setDate(newDate)
    setFormData((prev) => ({
      ...prev,
      date: newDate ? format(newDate, "yyyy-MM-dd") : "",
    }))
  }

  const calculateEndTime = () => {
    if (!selectedMovie || !formData.date || !formData.startTime) return "N/A"

    try {
      const startDateTime = parse(`${formData.date} ${formData.startTime}`, "yyyy-MM-dd HH:mm", new Date())

      const endDateTime = addMinutes(startDateTime, selectedMovie.duration)
      return format(endDateTime, "HH:mm")
    } catch (error) {
      return "N/A"
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Combine date and time into a single datetime
    const startDateTime = parse(`${formData.date} ${formData.startTime}`, "yyyy-MM-dd HH:mm", new Date())

    // Calculate end time based on movie duration
    const endDateTime = selectedMovie ? addMinutes(startDateTime, selectedMovie.duration) : startDateTime

    const processedData = {
      id: showtime?.id || Date.now(),
      movieId: Number.parseInt(formData.movieId),
      cinemaId: Number.parseInt(formData.cinemaId),
      screenId: Number.parseInt(formData.screenId),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      price: Number.parseInt(formData.price),
      availableSeats: Number.parseInt(formData.availableSeats),
    }

    onSave(processedData)
    onClose()
  }

  const dialogTitle = isAddMode ? "Thêm suất chiếu mới" : isEditMode ? "Chỉnh sửa suất chiếu" : "Chi tiết suất chiếu"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
          {!isViewMode && (
            <DialogDescription>
              {isAddMode ? "Nhập thông tin chi tiết về suất chiếu mới" : "Chỉnh sửa thông tin suất chiếu"}
            </DialogDescription>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="movieId">Phim</Label>
                <Select
                  value={formData.movieId}
                  onValueChange={(value) => handleSelectChange("movieId", value)}
                  disabled={isViewMode}
                  required
                >
                  <SelectTrigger id="movieId">
                    <SelectValue placeholder="Chọn phim" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMovies.map((movie) => (
                      <SelectItem key={movie.id} value={movie.id.toString()}>
                        {movie.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cinemaId">Rạp phim</Label>
                <Select
                  value={formData.cinemaId}
                  onValueChange={(value) => handleSelectChange("cinemaId", value)}
                  disabled={isViewMode}
                  required
                >
                  <SelectTrigger id="cinemaId">
                    <SelectValue placeholder="Chọn rạp phim" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCinemas.map((cinema) => (
                      <SelectItem key={cinema.id} value={cinema.id.toString()}>
                        {cinema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="screenId">Phòng chiếu</Label>
                <Select
                  value={formData.screenId}
                  onValueChange={(value) => handleSelectChange("screenId", value)}
                  disabled={isViewMode || availableScreens.length === 0}
                  required
                >
                  <SelectTrigger id="screenId">
                    <SelectValue
                      placeholder={
                        availableScreens.length === 0 && formData.cinemaId
                          ? "Không có phòng chiếu"
                          : availableScreens.length === 0
                            ? "Chọn rạp phim trước"
                            : "Chọn phòng chiếu"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableScreens.map((screen) => (
                      <SelectItem key={screen.id} value={screen.id.toString()}>
                        {screen.name} ({screen.type.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Giá vé (VND)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Ngày chiếu</Label>
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
                <Label htmlFor="startTime">Giờ bắt đầu</Label>
                <div className="relative">
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    disabled={isViewMode}
                    required
                  />
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endTime">Giờ kết thúc (dự kiến)</Label>
                <Input id="endTime" value={calculateEndTime()} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availableSeats">Số ghế trống</Label>
                <Input
                  id="availableSeats"
                  name="availableSeats"
                  type="number"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  disabled={isViewMode}
                  required
                />
              </div>
            </div>

            {selectedMovie && (
              <div className="rounded-lg border bg-gray-50 p-3">
                <h4 className="mb-2 font-medium text-gray-700">Thông tin phim</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Thời lượng:</span> {selectedMovie.duration} phút
                  </div>
                  <div>
                    <span className="text-gray-500">Thể loại:</span> {selectedMovie.genre}
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isViewMode && (
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isAddMode ? "Thêm suất chiếu" : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          )}

          {isViewMode && (
            <DialogFooter>
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
