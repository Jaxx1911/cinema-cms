"use client"

import { useState, useEffect, useMemo, use } from "react"
import { CalendarIcon, Clock, X, Edit, AlertCircle, CheckCircle } from "lucide-react"
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
import { useShowtimeData } from "@/contexts/showtime-context"
import { useScreensByCinema, useCinemas } from "@/hooks/use-cinemas"
import { useGetShowtimeById, useCheckShowtimeAvailable } from "@/hooks/use-showtime"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export function ShowtimeDialog({ 
  isOpen, 
  onClose, 
  showtime, 
  mode = "view", 
  onSave,
  setDialogMode = () => {}, 
  setIsShowtimeDialogOpen = () => {} 
}) {
  const isViewMode = mode === "view"
  const isEditMode = mode === "edit"
  const isAddMode = mode === "add"

  const [formData, setFormData] = useState({
    movieId: "",
    screenId: "",
    date: "",
    startTime: "",
    endTime: "",
    price: "",
  })

  const [date, setDate] = useState()
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedCinemaId, setSelectedCinemaId] = useState(null)
  const [isAvailabilityChecked, setIsAvailabilityChecked] = useState(false)
  const [conflicts, setConflicts] = useState([])

  const { newMovies, incomingMovies, cinemas, isLoading: isContextLoading } = useShowtimeData()
  const movies = useMemo(() => [...(newMovies || []), ...(incomingMovies || [])], [newMovies, incomingMovies])

  const { data: showtimeData, isLoading: isShowtimeLoading } = useGetShowtimeById(
    (isViewMode || isEditMode) ? showtime?.id : null
  )

  const { screens, isLoading: isScreensLoading } = useScreensByCinema(selectedCinemaId)

  const { 
    checkShowtimeAvailable, 
    isLoading: isCheckingAvailability, 
    error: checkAvailabilityError 
  } = useCheckShowtimeAvailable()

  const isLoading = isContextLoading || isScreensLoading || isShowtimeLoading

  useEffect(() => {
    if (isOpen) {
      if (isAddMode) {
        setFormData({
          movieId: "",
          cinemaId: "",
          screenId: "",
          date: "",
          startTime: "",
          endTime: "",
          price: "",
          soldSeats: 0,
        })
        setSelectedCinemaId(null)
        setDate(null)
        setSelectedMovie(null)
        setIsAvailabilityChecked(false)
        setConflicts([])
      } else if (showtimeData && (isViewMode || isEditMode)) {
        try {
          const startDateTime = new Date(showtimeData.start_time)
          const endDateTime = new Date(showtimeData.end_time)

          setFormData({
            movieId: showtimeData.movie_id.toString(),
            screenId: showtimeData.room_id?.toString(),
            date: format(startDateTime, "yyyy-MM-dd"),
            startTime: format(startDateTime, "HH:mm"),
            endTime: format(endDateTime, "HH:mm"),
            price: showtimeData.price.toString(),
            soldSeats: showtimeData?.tickets?.filter((ticket) => ticket.status !== "available").length,
          })

          setDate(startDateTime)
          setSelectedCinemaId(showtimeData.room.cinema_id)

          // Set selected movie
          const movie = movies.find((m) => m.id === showtimeData.movie_id)
          setSelectedMovie(movie)
          
          // Nếu là edit mode, cần reset trạng thái kiểm tra để hiển thị nút kiểm tra
          if (isEditMode) {
            setIsAvailabilityChecked(false)
            setConflicts([])
          }
        } catch (error) {
          console.error("Error setting form data:", error)
        }
      }
    }
  }, [isOpen, showtimeData, isViewMode, isEditMode, isAddMode, movies, mode])

  useEffect(() => {
    if (!isViewMode) {
      setIsAvailabilityChecked(false)
      setConflicts([])
    }
  }, [formData.movieId, formData.screenId, formData.date, formData.startTime, isViewMode])

  useEffect(() => {
    if (selectedMovie && formData.date && formData.startTime) {
      try {
        const startDateTime = parse(`${formData.date} ${formData.startTime}`, "yyyy-MM-dd HH:mm", new Date())
        const endDateTime = addMinutes(startDateTime, selectedMovie.duration)
        const endTimeStr = format(endDateTime, "HH:mm")
        
        setFormData(prev => ({...prev, endTime: endTimeStr}))
      } catch (error) {
        console.error("Error calculating end time", error)
      }
    }
  }, [selectedMovie, formData.date, formData.startTime])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "cinemaId") {
      setSelectedCinemaId(value)
      
      setFormData((prev) => ({ ...prev, screenId: "" }))
    }

    if (name === "movieId") {
      const movie = movies.find((m) => m.id === value)
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

  const handleCheckAvailability = () => {
    if (!formData.movieId || !formData.screenId || !formData.date || !formData.startTime) {
      alert("Vui lòng điền đầy đủ thông tin phim, phòng chiếu, ngày và giờ bắt đầu")
      return
    }

    const startDateTime = parse(`${formData.date} ${formData.startTime}`, "yyyy-MM-dd HH:mm", new Date())
    
    checkShowtimeAvailable({
      movieId: formData.movieId,
      roomId: formData.screenId,
      startTime: startDateTime.toISOString(),
      showtimeId: isEditMode ? showtime?.id : undefined
    }, {
      onSuccess: (data) => {
        setIsAvailabilityChecked(true)
        if (data.body.is_available) {
          setConflicts([])
        } else {
          setConflicts(data.body.conflicts || [])
        }
      },
      onError: (error) => {
        alert(`Lỗi kiểm tra tính khả dụng: ${error.message || "Đã xảy ra lỗi"}`)
        setIsAvailabilityChecked(false)
        setConflicts([])
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isAvailabilityChecked && !isViewMode) {
      alert("Vui lòng kiểm tra tính khả dụng trước khi lưu")
      return
    }

    if (conflicts.length > 0 && !isViewMode) {
      alert("Không thể tạo suất chiếu do xung đột lịch")
      return
    }

    const startDateTime = parse(`${formData.date} ${formData.startTime}`, "yyyy-MM-dd HH:mm", new Date())
    const endDateTime = parse(`${formData.date} ${formData.endTime}`, "yyyy-MM-dd HH:mm", new Date())

    const processedData = {
      id: showtime?.id || Date.now(),
      movieId: formData.movieId,
      screenId: formData.screenId,
      startTime: startDateTime.toISOString(),
      price: parseFloat(formData.price),
    }

    onSave(processedData)
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  const handleSwitchToEditMode = () => {
    handleClose()
    
    setTimeout(() => {
      setDialogMode("edit")
      setIsShowtimeDialogOpen(true)
    }, 100)
  }

  const dialogTitle = isAddMode ? "Thêm suất chiếu mới" : isEditMode ? "Chỉnh sửa suất chiếu" : "Chi tiết suất chiếu"

  const isFormValid = formData.movieId && formData.screenId && formData.date && formData.startTime && formData.price

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
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="movieId">Phim</Label>
                <Select
                  value={formData.movieId}
                  onValueChange={(value) => handleSelectChange("movieId", value)}
                  disabled={isViewMode || isLoading}
                  required
                >
                  <SelectTrigger id="movieId" style={{ opacity: 1 }} disabled={isViewMode || isEditMode}>
                    <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn phim"} />
                  </SelectTrigger>
                  <SelectContent >
                    {movies.map((movie) => (
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
                  value={selectedCinemaId}
                  onValueChange={(value) => handleSelectChange("cinemaId", value)}
                  disabled={isViewMode || isContextLoading}
                  required
                >
                  <SelectTrigger id="cinemaId" style={{ opacity: 1 }} disabled={isViewMode || isEditMode}>
                    <SelectValue placeholder={isContextLoading ? "Đang tải..." : "Chọn rạp phim"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cinemas.map((cinema) => (
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
                  disabled={isViewMode || !selectedCinemaId || isScreensLoading}
                  required
                >
                  <SelectTrigger id="screenId" style={{ opacity: 1 }}>
                    <SelectValue
                      placeholder={
                        isScreensLoading
                          ? "Đang tải phòng chiếu..."
                          : !selectedCinemaId
                            ? "Chọn rạp phim trước"
                            : screens.length === 0
                              ? "Không có phòng chiếu"
                              : "Chọn phòng chiếu"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {screens.sort((a, b) => a.name.localeCompare(b.name)).map((screen) => (
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
                  style={{ opacity: 1 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Ngày chiếu</Label>
                <Popover>
                  <PopoverTrigger asChild style={{ opacity: 1 }}>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      disabled={isViewMode}
                    >
                      {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soldSeats">Số vé đã bán</Label>
                <Input
                  id="soldSeats"
                  name="soldSeats"
                  type="number"
                  value={formData.soldSeats || 0}
                  onChange={handleChange}
                  disabled={true}
                  required
                  style={{ opacity: 1 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                    style={{ opacity: 1 }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Giờ kết thúc {mode === "add" ? " dự kiến" : ""} </Label>
                <Input id="endTime" value={formData.endTime} disabled style={{ opacity: 1 }} />
              </div>
            </div>

            {!isViewMode && (
              <div className="mt-2">
                {isAvailabilityChecked && conflicts.length === 0 ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Lịch chiếu khả dụng</AlertTitle>
                    <AlertDescription className="text-green-600">
                      Suất chiếu có thể được tạo với thông tin hiện tại.
                    </AlertDescription>
                  </Alert>
                ) : conflicts.length > 0 ? (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Lịch chiếu trùng</AlertTitle>
                    <AlertDescription className="text-red-600">
                      <p className="mb-2">Suất chiếu không thể được tạo do trùng với các suất chiếu sau:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {conflicts.map((conflict, index) => (
                          <li key={index}>
                            <strong>{conflict.movie_name}</strong> - {format(new Date(conflict.start_time), "HH:mm")} đến {format(new Date(conflict.end_time), "HH:mm")}
                          </li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>
            )}
          </div>

          {!isViewMode && (
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              {isFormValid && !isAvailabilityChecked && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                  onClick={handleCheckAvailability}
                  disabled={isCheckingAvailability}
                >
                  {isCheckingAvailability ? "Đang kiểm tra..." : "Kiểm tra hợp lệ"}
                </Button>
              )}
              <div className="flex justify-end gap-2 w-full">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!isFormValid || (!isAvailabilityChecked || conflicts.length > 0) && !isViewMode}
                >
                  {isAddMode ? "Thêm suất chiếu" : "Lưu thay đổi"}
                </Button>
              </div>
            </DialogFooter>
          )}

          {isViewMode && (
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                onClick={handleSwitchToEditMode}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button type="button" onClick={handleClose} className="bg-blue-600 hover:bg-blue-700 text-white">
                Đóng
              </Button>
            </DialogFooter>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
