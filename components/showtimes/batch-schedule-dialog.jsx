"use client"

import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, addDays, addMinutes, parse, eachDayOfInterval } from "date-fns"
import { vi } from "date-fns/locale"
import { useShowtimeData } from "@/contexts/showtime-context"
import { useScreensByCinema } from "@/hooks/use-cinemas"
import { useCheckAllShowtimeAvailable } from "@/hooks/use-showtime"
import { BatchScheduleForm } from "./batch-schedule-form"
import { BatchSchedulePreview } from "./batch-schedule-preview"

export function BatchScheduleDialog({ isOpen, onClose, onSave }) {
  // State cho form
  const [selectedMovie, setSelectedMovie] = useState("")
  const [selectedCinemaId, setSelectedCinemaId] = useState("")
  const [selectedScreens, setSelectedScreens] = useState([])
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 7))
  const [basePrice, setBasePrice] = useState("120000")
  const [error, setError] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [scheduleType, setScheduleType] = useState("daily") // daily, weekly, custom
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  })
  const [timeSlots, setTimeSlots] = useState([{ start: "10:00", end: '', priceAdjustment: "0" }])
  const [previewShowtimes, setPreviewShowtimes] = useState([])
  const [activeTab, setActiveTab] = useState("schedule")
  const [checkingStatus, setCheckingStatus] = useState({}) // Store checking status for each showtime
  const [isCheckingAll, setIsCheckingAll] = useState(false)
  const [hasOverlappingSlots, setHasOverlappingSlots] = useState(false)

  const { newMovies, incomingMovies, cinemas, isLoading: isContextLoading } = useShowtimeData()
  const movies = [...(newMovies || []), ...(incomingMovies || [])]
  
  const { screens, isLoading: isScreensLoading } = useScreensByCinema(selectedCinemaId)

  const { 
    checkAllShowtimeAvailable, 
    isLoading: isCheckingAvailability, 
    error: checkAvailabilityError 
  } = useCheckAllShowtimeAvailable()

  // Lấy thông tin phim đã chọn
  const selectedMovieDetails = selectedMovie
    ? movies.find((movie) => movie.id === selectedMovie)
    : null

  // Cập nhật danh sách phòng chiếu khi chọn rạp
  useEffect(() => {
    if (selectedCinemaId) {
      setSelectedScreens([]) // Reset selected screens when cinema changes
    } else {
      setSelectedScreens([])
    }
  }, [selectedCinemaId])

  // Cập nhật xem trước khi thay đổi các tham số
  useEffect(() => {
    if (selectedMovie && selectedScreens.length > 0 && startDate && endDate) {
      generatePreview()
    }
  }, [selectedMovie, selectedScreens, startDate, endDate, scheduleType, selectedDays, timeSlots])

  useEffect(() => {
    if (selectedMovie) {
      // Tính toán thời gian kết thúc cho tất cả các slot
      const updatedSlots = timeSlots.map((slot) => ({
        ...slot,
        end: addMinutes(parse(slot.start, "HH:mm", new Date()), selectedMovieDetails.duration).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      }))

      // Lọc ra các slot không giao nhau
      const validSlots = updatedSlots.reduce((acc, currentSlot, index) => {
        if (index === 0) {
          return [currentSlot]
        }

        const previousSlot = acc[acc.length - 1]
        const currentStart = parse(currentSlot.start, "HH:mm", new Date())
        const previousEnd = parse(previousSlot.end, "HH:mm", new Date())

        // Kiểm tra xem slot hiện tại có bắt đầu sau slot trước đó kết thúc không
        if (currentStart > previousEnd) {
          return [...acc, currentSlot]
        }

        // Nếu có giao nhau, bỏ qua slot này
        return acc
      }, [])

      setTimeSlots(validSlots)
    }
  }, [selectedMovie])

  // Thêm một khung giờ mới
  const addTimeSlot = () => {
    if (timeSlots.length === 0) {
      setTimeSlots([{ start: "10:00", end: null, priceAdjustment: "0" }])
      return
    }

    const lastSlot = timeSlots[timeSlots.length - 1]
    if (!lastSlot.end) return

    // Phân tích thời gian kết thúc
    const [hours, minutes] = lastSlot.end.split(':').map(Number)
    let roundedHours = hours
    let roundedMinutes = 0

    // Áp dụng các quy tắc làm tròn
    if (minutes < 15) {
      roundedMinutes = 30
    } else if (minutes < 30) {
      roundedMinutes = 45
    } else if (minutes < 45) {
      roundedHours = (hours + 1) % 24
      roundedMinutes = 0
    } else {
      roundedHours = (hours + 1) % 24
      roundedMinutes = 15
    }

    // Định dạng thời gian bắt đầu mới
    const newStartTime = `${roundedHours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`
    
    setTimeSlots([...timeSlots, { start: newStartTime, end: addMinutes(parse(newStartTime, "HH:mm", new Date()), selectedMovieDetails.duration).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }), priceAdjustment: "0" }])
  }

  // Xóa một khung giờ
  const removeTimeSlot = (index) => {
    if (timeSlots.length > 1) {
      const newTimeSlots = [...timeSlots]
      newTimeSlots.splice(index, 1)
      setTimeSlots(newTimeSlots)
    }
  }

  // Cập nhật khung giờ
  const updateTimeSlot = (index, field, value) => {
    const newTimeSlots = [...timeSlots]
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value }
    setTimeSlots(newTimeSlots)
  }

  // Xử lý khi chọn/bỏ chọn một phòng chiếu
  const handleScreenToggle = (screenId) => {
    if (selectedScreens.includes(screenId)) {
      setSelectedScreens(selectedScreens.filter((id) => id !== screenId))
    } else {
      setSelectedScreens([...selectedScreens, screenId])
    }
  }

  // Xử lý khi chọn/bỏ chọn tất cả phòng chiếu
  const handleToggleAllScreens = () => {
    if (selectedScreens.length === screens.length) {
      setSelectedScreens([])
    } else {
      setSelectedScreens(screens.map((screen) => screen.id))
    }
  }

  // Kiểm tra xem một ngày có được chọn không (dựa vào scheduleType và selectedDays)
  const isDaySelected = (date) => {
    if (scheduleType === "daily") {
      return true
    }

    if (scheduleType === "weekly") {
      const dayOfWeek = format(date, "EEEE", { locale: vi }).toLowerCase()
      const dayMap = {
        "thứ hai": "monday",
        "thứ ba": "tuesday",
        "thứ tư": "wednesday",
        "thứ năm": "thursday",
        "thứ sáu": "friday",
        "thứ bảy": "saturday",
        "chủ nhật": "sunday",
      }
      const englishDay = dayMap[dayOfWeek] || dayOfWeek
      return selectedDays[englishDay]
    }

    return true
  }

  const handleCheckAllSchedules = () => {
    if (!selectedMovie || selectedScreens.length === 0 || previewShowtimes.length === 0) {
      alert("Vui lòng chọn phim, phòng chiếu và tạo xem trước lịch chiếu trước khi kiểm tra")
      return
    }

    setIsCheckingAll(true)
    setCheckingStatus({})

    let showtimes = previewShowtimes.map(showtime => ({
        movieId: showtime.movieId,
      screenId: showtime.screenId,
      startTime: showtime.startTime
    }))

    checkAllShowtimeAvailable({ showtimes }, {
      onSuccess: (data) => {
        if (!data || !data.body) {
          throw new Error('Invalid response from server')
        }

        const results = data.body.results || []

        const newCheckingStatus = {}
        previewShowtimes.forEach((showtime, index) => {
          const result = results[index]
        
        if (result) {
          newCheckingStatus[showtime.id] = {
            isValid: result.is_available,
            conflicts: result.conflicts || []
          }
          } else {
            newCheckingStatus[showtime.id] = {
              isValid: false,
              conflicts: [],
              error: 'Không tìm thấy kết quả kiểm tra'
            }
        }
      })

      setCheckingStatus(newCheckingStatus)
        setIsCheckingAll(false)
      },
      onError: (error) => {
      console.error("Error checking schedules:", error)
      const errorStatus = previewShowtimes.reduce((acc, showtime) => {
        acc[showtime.id] = {
          isValid: false,
          conflicts: [],
          error: error.message
        }
        return acc
      }, {})
      setCheckingStatus(errorStatus)
        setIsCheckingAll(false)
    }
    })
  }

  // Tạo xem trước các suất chiếu
  const generatePreview = () => {
    if (!selectedMovieDetails) return
    
    const preview = []
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    for (const day of days) {
      if (isDaySelected(day)) {
        for (const screenId of selectedScreens) {
          for (const slot of timeSlots) {
            const screenObj = screens.find((s) => s.id === screenId)
            if (!screenObj) continue

            const dateStr = format(day, "yyyy-MM-dd")
            const startTime = parse(`${dateStr} ${slot.start}`, "yyyy-MM-dd HH:mm", new Date())
            const endTime = addMinutes(startTime, selectedMovieDetails.duration)

            const price = Number.parseInt(basePrice) + Number.parseInt(slot.priceAdjustment || "0")

            preview.push({
              id: `${day.getTime()}-${screenId}-${slot.start}`, // Unique ID for each showtime
              movieId: selectedMovie,
              cinemaId: selectedCinemaId,
              screenId: screenId,
              screenName: screenObj.name,
              startTime: startTime,
              endTime: endTime,
              price: price,
              date: day,
            })
          }
        }
      }
    }
    setPreviewShowtimes(preview)
  }

  // Xử lý khi lưu các suất chiếu
  const handleSave = () => {
    if (!selectedMovie || selectedScreens.length === 0 || timeSlots.length === 0) {
      setError("Vui lòng chọn phim, ít nhất một phòng chiếu và một khung giờ")
      return
    }

    if (previewShowtimes.length === 0) {
      setError("Không có suất chiếu nào được tạo. Vui lòng kiểm tra lại các thông số.")
      return
    }

    const showtimeData = previewShowtimes.map(showtime => ({
      movieId: showtime.movieId,
      screenId: showtime.screenId,
      startTime: showtime.startTime,
      price: showtime.price,
    }))

    onSave(showtimeData)
  }

  // Sao chép lịch từ một ngày sang các ngày khác
  const copySchedule = () => {
    setActiveTab("preview")
    setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-none">
        <DialogHeader>
          <DialogTitle className="text-xl">Thêm suất chiếu theo lịch</DialogTitle>
          <DialogDescription>Tạo nhiều suất chiếu theo một lịch trình cố định</DialogDescription>
        </DialogHeader>

        {checkAvailabilityError && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Lỗi</AlertTitle>
            <AlertDescription>{checkAvailabilityError}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Thiết lập lịch</TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedMovie || selectedScreens.length === 0}>
              Xem trước ({previewShowtimes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <BatchScheduleForm
              selectedMovie={selectedMovie}
              setSelectedMovie={setSelectedMovie}
              selectedCinemaId={selectedCinemaId}
              setSelectedCinemaId={setSelectedCinemaId}
              selectedScreens={selectedScreens}
              setSelectedScreens={setSelectedScreens}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              basePrice={basePrice}
              setBasePrice={setBasePrice}
              error={error}
              showSuccessMessage={showSuccessMessage}
              scheduleType={scheduleType}
              setScheduleType={setScheduleType}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              timeSlots={timeSlots}
              setTimeSlots={setTimeSlots}
              previewShowtimes={previewShowtimes}
              movies={movies}
              cinemas={cinemas}
              screens={screens}
              isContextLoading={isContextLoading}
              isScreensLoading={isScreensLoading}
              selectedMovieDetails={selectedMovieDetails}
              onAddTimeSlot={addTimeSlot}
              onRemoveTimeSlot={removeTimeSlot}
              onUpdateTimeSlot={updateTimeSlot}
              onToggleAllScreens={handleToggleAllScreens}
              onScreenToggle={handleScreenToggle}
              onOverlappingSlotsChange={setHasOverlappingSlots}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 py-4">
            <BatchSchedulePreview
              previewShowtimes={previewShowtimes}
              selectedMovieDetails={selectedMovieDetails}
              startDate={startDate}
              endDate={endDate}
              checkingStatus={checkingStatus}
              isCheckingAll={isCheckingAll}
              onCheckAllSchedules={handleCheckAllSchedules}
              onBackToSchedule={() => setActiveTab("schedule")}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          {activeTab === "schedule" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={copySchedule}
              disabled={!selectedMovie || selectedScreens.length === 0 || hasOverlappingSlots}
            >
              Xem trước lịch chiếu
            </Button>
          )}
          {activeTab === "preview" && (
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSave}
              disabled={previewShowtimes.length === 0 || Object.values(checkingStatus).some(status => !status.isValid)}
            >
              Thêm {previewShowtimes.length > 0 ? `${previewShowtimes.length} suất chiếu` : "suất chiếu"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
