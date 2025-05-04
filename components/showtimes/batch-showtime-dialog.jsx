"use client"

import { useState, useEffect, useRef } from "react"
import { X, Calendar, AlertCircle, Info, Plus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format, addMinutes, parse, areIntervalsOverlapping } from "date-fns"
import { vi } from "date-fns/locale"
import { mockCinemas, mockScreens, mockMovies } from "@/lib/mock-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Dữ liệu mẫu cho các suất chiếu - sử dụng ngày hiện tại
const today = new Date().toISOString().split("T")[0] // Lấy ngày hiện tại dạng YYYY-MM-DD

const sampleShowtimes = [
  {
    id: 101,
    movieId: 1, // Avengers: Endgame
    cinemaId: 1,
    screenId: 1,
    startTime: `${today}T09:30:00`,
    endTime: `${today}T12:31:00`,
  },
  {
    id: 102,
    movieId: 2, // Joker
    cinemaId: 1,
    screenId: 1,
    startTime: `${today}T13:00:00`,
    endTime: `${today}T15:02:00`,
  },
  {
    id: 103,
    movieId: 3, // Parasite
    cinemaId: 1,
    screenId: 1,
    startTime: `${today}T18:30:00`,
    endTime: `${today}T20:42:00`,
  },
  {
    id: 104,
    movieId: 4, // The Dark Knight
    cinemaId: 1,
    screenId: 2,
    startTime: `${today}T10:00:00`,
    endTime: `${today}T12:32:00`,
  },
  {
    id: 105,
    movieId: 5, // Inception
    cinemaId: 1,
    screenId: 2,
    startTime: `${today}T15:30:00`,
    endTime: `${today}T17:58:00`,
  },
  {
    id: 106,
    movieId: 1, // Avengers: Endgame
    cinemaId: 1,
    screenId: 3,
    startTime: `${today}T11:00:00`,
    endTime: `${today}T14:01:00`,
  },
  {
    id: 107,
    movieId: 2, // Joker
    cinemaId: 1,
    screenId: 3,
    startTime: `${today}T16:30:00`,
    endTime: `${today}T18:32:00`,
  },
  {
    id: 108,
    movieId: 3, // Parasite
    cinemaId: 1,
    screenId: 3,
    startTime: `${today}T20:00:00`,
    endTime: `${today}T22:12:00`,
  },
  {
    id: 109,
    movieId: 5, // Inception
    cinemaId: 1,
    screenId: 4,
    startTime: `${today}T09:00:00`,
    endTime: `${today}T11:28:00`,
  },
  {
    id: 110,
    movieId: 4, // The Dark Knight
    cinemaId: 1,
    screenId: 4,
    startTime: `${today}T14:00:00`,
    endTime: `${today}T16:32:00`,
  },
  {
    id: 111,
    movieId: 1, // Avengers: Endgame
    cinemaId: 1,
    screenId: 4,
    startTime: `${today}T19:00:00`,
    endTime: `${today}T22:01:00`,
  },
]

// Tạo các khung giờ từ 8:00 đến 23:00 với bước 15 phút
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 8; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`)
    }
  }
  return slots
}

const timeSlots = generateTimeSlots()

export function BatchShowtimeDialog({ isOpen, onClose, onSave }) {
  // State cho form
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCinema, setSelectedCinema] = useState("1")
  const [selectedMovie, setSelectedMovie] = useState("2") // Mặc định chọn phim Joker
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]) // Mảng các suất chiếu đã chọn
  const [error, setError] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [draggingSlot, setDraggingSlot] = useState(null) // State cho việc kéo thả
  const [timelineWidth, setTimelineWidth] = useState(0) // Chiều rộng của timeline

  // Refs
  const timelineRefs = useRef({}) // Ref cho các timeline
  const dragStartXRef = useRef(0) // Vị trí X khi bắt đầu kéo
  const dragStartTimeRef = useRef(null) // Thời gian khi bắt đầu kéo

  // State cho dữ liệu
  const [availableScreens, setAvailableScreens] = useState([])
  const [showtimes, setShowtimes] = useState(sampleShowtimes)

  // Lấy thông tin phim đã chọn
  const selectedMovieDetails = selectedMovie
    ? mockMovies.find((movie) => movie.id === Number.parseInt(selectedMovie))
    : null

  // Cập nhật danh sách phòng chiếu khi chọn rạp
  useEffect(() => {
    if (selectedCinema) {
      const screens = mockScreens.filter((screen) => screen.cinemaId === Number.parseInt(selectedCinema))
      setAvailableScreens(screens)
    } else {
      setAvailableScreens([])
    }
  }, [selectedCinema])

  // Lọc suất chiếu theo ngày và rạp đã chọn
  const filteredShowtimes = showtimes.filter((showtime) => {
    const showtimeDate = new Date(showtime.startTime).toISOString().split("T")[0]
    const selectedDateStr = selectedDate.toISOString().split("T")[0]

    return showtimeDate === selectedDateStr && showtime.cinemaId === Number.parseInt(selectedCinema)
  })

  // Tạo các khung giờ hiển thị trên timeline (chỉ hiển thị giờ chẵn)
  const timelineHours = Array.from({ length: 16 }, (_, i) => i + 8)

  // Kiểm tra xem một khung giờ có khả dụng cho một phòng chiếu không
  const isTimeSlotAvailable = (screenId, timeSlot) => {
    if (!selectedMovieDetails) return false

    const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
    const startTime = parse(`${selectedDateStr} ${timeSlot}`, "yyyy-MM-dd HH:mm", new Date())
    const endTime = addMinutes(startTime, selectedMovieDetails.duration)

    // Kiểm tra xem khung giờ này có trùng với suất chiếu nào đã tồn tại không
    const screenShowtimes = filteredShowtimes.filter((showtime) => showtime.screenId === screenId)

    for (const showtime of screenShowtimes) {
      const showtimeStart = new Date(showtime.startTime)
      const showtimeEnd = new Date(showtime.endTime)

      if (areIntervalsOverlapping({ start: startTime, end: endTime }, { start: showtimeStart, end: showtimeEnd })) {
        return false
      }
    }

    // Kiểm tra xem thời gian kết thúc có trước nửa đêm không
    const midnight = parse(`${selectedDateStr} 23:59`, "yyyy-MM-dd HH:mm", new Date())
    if (endTime > midnight) {
      return false
    }

    return true
  }

  // Tìm các khoảng trống có thể thêm suất chiếu
  const findAvailableGaps = (screenId) => {
    if (!selectedMovieDetails) return []

    const movieDurationMinutes = selectedMovieDetails.duration
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
    const screenShowtimes = filteredShowtimes.filter((showtime) => showtime.screenId === screenId)

    // Sắp xếp các suất chiếu theo thời gian bắt đầu
    const sortedShowtimes = [...screenShowtimes].sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )

    const gaps = []

    // Thời gian bắt đầu trong ngày (8:00)
    let startTime = parse(`${selectedDateStr} 08:00`, "yyyy-MM-dd HH:mm", new Date())

    // Thời gian kết thúc trong ngày (23:59)
    const endOfDay = parse(`${selectedDateStr} 23:59`, "yyyy-MM-dd HH:mm", new Date())

    // Thêm khoảng trống từ 8:00 đến suất chiếu đầu tiên (nếu có)
    if (sortedShowtimes.length > 0) {
      for (const showtime of sortedShowtimes) {
        const showtimeStart = new Date(showtime.startTime)
        const showtimeEnd = new Date(showtime.endTime)

        // Nếu có khoảng trống giữa thời gian bắt đầu và suất chiếu hiện tại
        if (startTime < showtimeStart) {
          const gapDuration = (showtimeStart.getTime() - startTime.getTime()) / (60 * 1000) // Độ dài khoảng trống (phút)

          // Nếu khoảng trống đủ lớn để thêm suất chiếu
          if (gapDuration >= movieDurationMinutes) {
            gaps.push({
              start: startTime,
              end: showtimeStart,
              duration: gapDuration,
            })
          }
        }

        // Cập nhật thời gian bắt đầu cho khoảng trống tiếp theo
        startTime = showtimeEnd
      }
    }

    // Thêm khoảng trống từ suất chiếu cuối cùng đến cuối ngày (nếu có)
    if (startTime < endOfDay) {
      const gapDuration = (endOfDay.getTime() - startTime.getTime()) / (60 * 1000)

      if (gapDuration >= movieDurationMinutes) {
        gaps.push({
          start: startTime,
          end: endOfDay,
          duration: gapDuration,
        })
      }
    }

    return gaps
  }

  // Xử lý khi chọn một khung giờ
  const handleTimeSlotClick = (screenId, startTime) => {
    if (!selectedMovie) {
      setError("Vui lòng chọn phim trước khi chọn suất chiếu")
      return
    }

    // Tạo ID duy nhất cho suất chiếu đã chọn
    const slotId = `${screenId}-${format(startTime, "HH:mm")}`

    // Kiểm tra xem đã chọn khung giờ này chưa
    const isAlreadySelected = selectedTimeSlots.some((slot) => slot.id === slotId)

    if (isAlreadySelected) {
      // Nếu đã chọn rồi thì bỏ chọn
      setSelectedTimeSlots(selectedTimeSlots.filter((slot) => slot.id !== slotId))
    } else {
      // Nếu chưa chọn thì thêm vào danh sách
      setSelectedTimeSlots([
        ...selectedTimeSlots,
        {
          id: slotId,
          screenId,
          startTime: format(startTime, "HH:mm"),
          startTimeObj: startTime,
        },
      ])
    }

    setError("")
  }

  // Xử lý khi bắt đầu kéo
  const handleDragStart = (e, slot) => {
    e.stopPropagation()
    setDraggingSlot(slot)
    dragStartXRef.current = e.clientX
    dragStartTimeRef.current = parse(
      `${format(selectedDate, "yyyy-MM-dd")} ${slot.startTime}`,
      "yyyy-MM-dd HH:mm",
      new Date(),
    )
  }

  // Xử lý khi kéo
  const handleDrag = (e, screenId) => {
    if (!draggingSlot || !timelineRefs.current[screenId]) return

    const timelineRect = timelineRefs.current[screenId].getBoundingClientRect()
    const timelineWidth = timelineRect.width
    setTimelineWidth(timelineWidth)

    // Tính toán vị trí mới dựa trên khoảng cách kéo
    const deltaX = e.clientX - dragStartXRef.current

    // Tính toán thời gian mới (mỗi pixel tương ứng với bao nhiêu phút)
    const minutesPerPixel = (16 * 60) / timelineWidth // 16 giờ (8:00 - 24:00) * 60 phút
    const deltaMinutes = Math.round(deltaX * minutesPerPixel)

    if (deltaMinutes === 0) return

    // Tính toán thời gian mới
    const newTime = new Date(dragStartTimeRef.current)
    newTime.setMinutes(newTime.getMinutes() + deltaMinutes)

    // Làm tròn đến 15 phút gần nhất
    const minutes = newTime.getMinutes()
    const roundedMinutes = Math.round(minutes / 15) * 15
    newTime.setMinutes(roundedMinutes)

    // Kiểm tra giới hạn thời gian (8:00 - 23:45)
    if (newTime.getHours() < 8) {
      newTime.setHours(8)
      newTime.setMinutes(0)
    } else if (newTime.getHours() >= 23 && newTime.getMinutes() > 45) {
      newTime.setHours(23)
      newTime.setMinutes(45)
    }

    // Kiểm tra xem thời gian mới có hợp lệ không
    const newTimeStr = format(newTime, "HH:mm")
    if (isTimeSlotAvailable(screenId, newTimeStr)) {
      // Cập nhật vị trí mới
      const updatedSlots = selectedTimeSlots.map((slot) => {
        if (slot.id === draggingSlot.id) {
          return {
            ...slot,
            startTime: newTimeStr,
            startTimeObj: newTime,
          }
        }
        return slot
      })

      setSelectedTimeSlots(updatedSlots)
      dragStartXRef.current = e.clientX
      dragStartTimeRef.current = newTime
    }
  }

  // Xử lý khi kết thúc kéo
  const handleDragEnd = () => {
    setDraggingSlot(null)
  }

  // Xử lý khi lưu suất chiếu mới
  const handleSave = () => {
    if (!selectedMovie || selectedTimeSlots.length === 0) {
      setError("Vui lòng chọn phim và ít nhất một khung giờ chiếu")
      return
    }

    const newShowtimes = []
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd")

    // Tạo suất chiếu mới cho mỗi khung giờ đã chọn
    for (const slot of selectedTimeSlots) {
      const startTime = parse(`${selectedDateStr} ${slot.startTime}`, "yyyy-MM-dd HH:mm", new Date())
      const endTime = addMinutes(startTime, selectedMovieDetails.duration)

      const newShowtime = {
        id: Math.max(...showtimes.map((s) => s.id)) + 1 + newShowtimes.length,
        movieId: Number.parseInt(selectedMovie),
        cinemaId: Number.parseInt(selectedCinema),
        screenId: slot.screenId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        price: 120000,
        availableSeats: 100,
      }

      newShowtimes.push(newShowtime)
    }

    // Cập nhật danh sách suất chiếu
    setShowtimes([...showtimes, ...newShowtimes])

    // Gọi callback để thông báo đã thêm suất chiếu mới
    for (const newShowtime of newShowtimes) {
      onSave(newShowtime)
    }

    setShowSuccessMessage(true)
    setSelectedTimeSlots([]) // Xóa danh sách đã chọn

    setTimeout(() => {
      setShowSuccessMessage(false)
    }, 3000)
  }

  // Tính toán vị trí và độ rộng của suất chiếu
  const calculateShowtimePosition = (startTime, endTime) => {
    const startHour = startTime.getHours() + startTime.getMinutes() / 60
    const endHour = endTime.getHours() + endTime.getMinutes() / 60

    // Tính toán vị trí bắt đầu (tính từ 8:00)
    const startPosition = startHour - 8

    // Tính toán độ rộng (số giờ)
    const width = endHour - startHour

    return { startPosition, width }
  }

  // Kiểm tra xem một khung giờ có được chọn không
  const isTimeSlotSelected = (screenId, startTime) => {
    const timeStr = format(startTime, "HH:mm")
    return selectedTimeSlots.some((slot) => slot.screenId === screenId && slot.startTime === timeStr)
  }

  // Render các khoảng trống có thể thêm suất chiếu
  const renderAvailableGaps = (screenId) => {
    if (!selectedMovieDetails) return null

    const gaps = findAvailableGaps(screenId)
    const movieDurationHours = selectedMovieDetails.duration / 60

    return gaps.map((gap, index) => {
      // Tính toán vị trí và độ rộng của khoảng trống
      const { startPosition, width } = calculateShowtimePosition(gap.start, gap.end)

      // Tạo các nút "Thêm" trong khoảng trống
      const buttons = []
      const startHour = gap.start.getHours() + gap.start.getMinutes() / 60
      const endHour = gap.end.getHours() + gap.end.getMinutes() / 60
      const maxEndHour = endHour - movieDurationHours

      // Tạo các nút "Thêm" với bước 15 phút
      for (let hour = startHour; hour <= maxEndHour; hour += 0.25) {
        const currentHour = Math.floor(hour)
        const currentMinute = Math.round((hour - currentHour) * 60)

        const currentTime = new Date(selectedDate)
        currentTime.setHours(currentHour, currentMinute, 0)

        // Kiểm tra xem thời gian này có hợp lệ không
        if (isTimeSlotAvailable(screenId, format(currentTime, "HH:mm"))) {
          const position = hour - 8 // Vị trí tính từ 8:00
          const isSelected = isTimeSlotSelected(screenId, currentTime)

          // Chỉ hiển thị các nút cách nhau 30 phút để tránh quá đông
          if (currentMinute % 30 === 0) {
            buttons.push(
              <div
                key={`${screenId}-${format(currentTime, "HH:mm")}`}
                className={`absolute h-10 border ${
                  isSelected ? "border-green-500 bg-green-300" : "border-green-300 bg-green-100 hover:bg-green-200"
                } rounded-md flex items-center justify-center cursor-pointer transition-colors`}
                style={{
                  left: `${(position / 16) * 100}%`,
                  width: `${(movieDurationHours / 16) * 100}%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: isSelected ? 10 : 5,
                }}
                onClick={() => handleTimeSlotClick(screenId, currentTime)}
                draggable={isSelected}
                onDragStart={(e) =>
                  handleDragStart(e, {
                    id: `${screenId}-${format(currentTime, "HH:mm")}`,
                    screenId,
                    startTime: format(currentTime, "HH:mm"),
                  })
                }
                onDrag={(e) => handleDrag(e, screenId)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center justify-center text-xs">
                  {isSelected ? (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{format(currentTime, "HH:mm")}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Plus className="h-3 w-3 mr-1" />
                      <span>Thêm</span>
                    </div>
                  )}
                </div>
              </div>,
            )
          }
        }
      }

      return buttons
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Thêm suất chiếu hàng loạt</DialogTitle>
          <DialogDescription>Chọn rạp, phim và ngày để thêm nhiều suất chiếu cùng lúc</DialogDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cinema">Rạp phim</Label>
              <Select value={selectedCinema} onValueChange={setSelectedCinema}>
                <SelectTrigger id="cinema">
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

            <div className="space-y-2">
              <Label htmlFor="movie">Phim</Label>
              <Select value={selectedMovie} onValueChange={setSelectedMovie}>
                <SelectTrigger id="movie">
                  <SelectValue placeholder="Chọn phim" />
                </SelectTrigger>
                <SelectContent>
                  {mockMovies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id.toString()}>
                      {movie.title} ({movie.duration} phút)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Ngày chiếu</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {showSuccessMessage && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <Info className="h-4 w-4 text-green-800" />
              <AlertTitle>Thành công</AlertTitle>
              <AlertDescription>Đã thêm {selectedTimeSlots.length} suất chiếu mới thành công</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Lịch chiếu</h3>
              <div className="flex items-center text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                  <span>Đã đặt</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 rounded-sm mr-1"></div>
                  <span>Có thể thêm</span>
                </div>
              </div>
            </div>

            {!selectedMovie && (
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <Info className="h-4 w-4 text-blue-800" />
                <AlertTitle>Hướng dẫn</AlertTitle>
                <AlertDescription>
                  Vui lòng chọn phim để xem các khung giờ có thể thêm suất chiếu. Bạn có thể kéo các nút "Thêm" đã chọn
                  để điều chỉnh thời gian bắt đầu.
                </AlertDescription>
              </Alert>
            )}

            <div className="overflow-x-auto pb-2">
              <div className="min-w-[800px]">
                <div className="mb-2 flex">
                  <div className="w-40"></div>
                  <div className="flex-1 grid grid-cols-16">
                    {timelineHours.map((hour) => (
                      <div key={hour} className="text-center text-xs text-gray-500">
                        {hour}:00
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danh sách phòng chiếu */}
                <div className="space-y-4">
                  {availableScreens.map((screen) => {
                    // Lọc các suất chiếu của phòng này
                    const screenShowtimes = filteredShowtimes.filter((showtime) => showtime.screenId === screen.id)

                    return (
                      <div key={screen.id} className="flex">
                        <div className="w-40 pr-4">
                          <div className="font-medium">{screen.name}</div>
                          <div className="text-sm text-gray-500">
                            {screen.type === "2d"
                              ? "2D"
                              : screen.type === "3d"
                                ? "3D"
                                : screen.type === "4dx"
                                  ? "4DX"
                                  : screen.type === "imax"
                                    ? "IMAX"
                                    : screen.type}
                            {" • "}
                            {screen.capacity} ghế
                          </div>
                        </div>

                        <div
                          className="flex-1 relative h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200"
                          ref={(el) => (timelineRefs.current[screen.id] = el)}
                        >
                          {/* Hiển thị các suất chiếu đã có */}
                          {screenShowtimes.map((showtime) => {
                            const movie = mockMovies.find((m) => m.id === showtime.movieId)
                            const startTime = new Date(showtime.startTime)
                            const endTime = new Date(showtime.endTime)

                            const { startPosition, width } = calculateShowtimePosition(startTime, endTime)

                            // Chọn màu dựa trên phim
                            const colors = [
                              "bg-blue-500",
                              "bg-purple-500",
                              "bg-green-500",
                              "bg-yellow-500",
                              "bg-red-500",
                              "bg-indigo-500",
                            ]
                            const colorIndex = (showtime.movieId - 1) % colors.length
                            const bgColor = colors[colorIndex]

                            return (
                              <TooltipProvider key={showtime.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`absolute h-10 ${bgColor} text-white text-xs flex items-center justify-center overflow-hidden rounded-md border border-white`}
                                      style={{
                                        left: `${(startPosition / 16) * 100}%`,
                                        width: `${(width / 16) * 100}%`,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                      }}
                                    >
                                      <span className="truncate px-1">{movie?.title}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-sm">
                                      <p className="font-bold">{movie?.title}</p>
                                      <p>
                                        Thời gian: {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                                      </p>
                                      <p>Thời lượng: {movie?.duration} phút</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )
                          })}

                          {/* Hiển thị các khoảng trống có thể thêm */}
                          {selectedMovieDetails && renderAvailableGaps(screen.id)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {selectedTimeSlots.length > 0 && selectedMovieDetails && (
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Suất chiếu đã chọn ({selectedTimeSlots.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-40 overflow-y-auto">
                {selectedTimeSlots.map((slot, index) => {
                  const screen = availableScreens.find((s) => s.id === slot.screenId)
                  const selectedDateStr = format(selectedDate, "yyyy-MM-dd")
                  const startTime = parse(`${selectedDateStr} ${slot.startTime}`, "yyyy-MM-dd HH:mm", new Date())
                  const endTime = addMinutes(startTime, selectedMovieDetails.duration)

                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white p-2 rounded border border-blue-100"
                    >
                      <div>
                        <p className="font-medium">{screen?.name}</p>
                        <p className="text-sm text-gray-500">
                          {format(startTime, "HH:mm")} - {format(endTime, "HH:mm")}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setSelectedTimeSlots(selectedTimeSlots.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            disabled={selectedTimeSlots.length === 0}
          >
            Thêm {selectedTimeSlots.length > 0 ? `${selectedTimeSlots.length} suất chiếu` : "suất chiếu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
