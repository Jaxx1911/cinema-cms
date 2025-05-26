"use client"

import { useState, useEffect } from "react"
import { X, Calendar, AlertCircle, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { format, addDays, addMinutes, parse, isBefore } from "date-fns"
import { vi } from "date-fns/locale"

export function BatchScheduleForm({
  selectedMovie,
  setSelectedMovie,
  selectedCinemaId,
  setSelectedCinemaId,
  selectedScreens,
  setSelectedScreens,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  basePrice,
  setBasePrice,
  error,
  showSuccessMessage,
  scheduleType,
  setScheduleType,
  selectedDays,
  setSelectedDays,
  timeSlots,
  setTimeSlots,
  previewShowtimes,
  movies,
  cinemas,
  screens,
  isContextLoading,
  isScreensLoading,
  selectedMovieDetails,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onUpdateTimeSlot,
  onToggleAllScreens,
  onScreenToggle,
  onOverlappingSlotsChange
}) {
  const [overlappingSlots, setOverlappingSlots] = useState([])

  // Kiểm tra trùng lặp thời gian giữa các slot
  const checkTimeSlotOverlaps = () => {
    if (!selectedMovieDetails || timeSlots.length <= 1) {
      setOverlappingSlots([])
      return
    }

    const overlaps = []
    
    for (let i = 0; i < timeSlots.length; i++) {
      const currentSlot = timeSlots[i]
      if (!currentSlot.start || !currentSlot.end) continue
      
      const currentStart = parse(currentSlot.start, "HH:mm", new Date())
      const currentEnd = parse(currentSlot.end, "HH:mm", new Date())
      
      for (let j = i + 1; j < timeSlots.length; j++) {
        const otherSlot = timeSlots[j]
        if (!otherSlot.start || !otherSlot.end) continue
        
        const otherStart = parse(otherSlot.start, "HH:mm", new Date())
        const otherEnd = parse(otherSlot.end, "HH:mm", new Date())
        
        // Kiểm tra xem có trùng lặp không
        const hasOverlap = (currentStart < otherEnd && currentEnd > otherStart)
        
        if (hasOverlap) {
          if (!overlaps.includes(i)) overlaps.push(i)
          if (!overlaps.includes(j)) overlaps.push(j)
        }
      }
    }
    
    setOverlappingSlots(overlaps)
  }

  // Kiểm tra trùng lặp mỗi khi timeSlots thay đổi
  useEffect(() => {
    checkTimeSlotOverlaps()
  }, [timeSlots, selectedMovieDetails])

  // Thông báo cho component cha về trạng thái overlapping
  useEffect(() => {
    if (onOverlappingSlotsChange) {
      onOverlappingSlotsChange(overlappingSlots.length > 0)
    }
  }, [overlappingSlots, onOverlappingSlotsChange])

  return (
    <div className="space-y-6 py-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {overlappingSlots.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cảnh báo trùng lặp thời gian</AlertTitle>
          <AlertDescription>
            Các khung giờ số {overlappingSlots.map(i => i + 1).join(", ")} có thời gian trùng lặp. 
            Vui lòng điều chỉnh lại thời gian để tránh xung đột.
          </AlertDescription>
        </Alert>
      )}

      {showSuccessMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 text-green-800" />
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>Đã thêm {previewShowtimes.length} suất chiếu mới thành công</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="movie">Phim</Label>
            <Select 
              value={selectedMovie} 
              onValueChange={setSelectedMovie}
              disabled={isContextLoading}
            >
              <SelectTrigger id="movie" style={{ opacity: 1 }}>
                <SelectValue placeholder={isContextLoading ? "Đang tải..." : "Chọn phim"} />
              </SelectTrigger>
              <SelectContent>
                {movies.map((movie) => (
                  <SelectItem key={movie.id} value={movie.id}>
                    {movie.title} ({movie.duration} phút)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cinema">Rạp phim</Label>
            <Select 
              value={selectedCinemaId} 
              onValueChange={setSelectedCinemaId}
              disabled={isContextLoading}
            >
              <SelectTrigger id="cinema" style={{ opacity: 1 }}>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Phòng chiếu</Label>
              {screens.length > 0 && !isScreensLoading && (
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onToggleAllScreens}>
                  {selectedScreens.length === screens.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                </Button>
              )}
            </div>
            {isScreensLoading ? (
              <div className="text-sm text-gray-500 italic">Đang tải phòng chiếu...</div>
            ) : screens.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                {screens.sort((a, b) => a.name.localeCompare(b.name)).map((screen) => (
                  <div key={screen.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`screen-${screen.id}`}
                      checked={selectedScreens.includes(screen.id)}
                      onCheckedChange={() => onScreenToggle(screen.id)}
                    />
                    <label
                      htmlFor={`screen-${screen.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {screen.name} ({screen.type.toUpperCase()})
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">Vui lòng chọn rạp phim trước</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="basePrice">Giá vé cơ bản (VND)</Label>
            <Input
              id="basePrice"
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              min="0"
              step="10000"
              style={{ opacity: 1 }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Loại lịch trình</Label>
            <Select value={scheduleType} onValueChange={setScheduleType}>
              <SelectTrigger style={{ opacity: 1 }}>
                <SelectValue placeholder="Chọn loại lịch trình" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Hàng ngày</SelectItem>
                <SelectItem value="weekly">Hàng tuần (chọn ngày)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {scheduleType === "weekly" && (
            <div className="space-y-2">
              <Label>Chọn ngày trong tuần</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="monday"
                    checked={selectedDays.monday}
                    onCheckedChange={(checked) => setSelectedDays({ ...selectedDays, monday: !!checked })}
                  />
                  <label
                    htmlFor="monday"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Thứ Hai
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tuesday"
                    checked={selectedDays.tuesday}
                    onCheckedChange={(checked) => setSelectedDays({ ...selectedDays, tuesday: !!checked })}
                  />
                  <label
                    htmlFor="tuesday"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Thứ Ba
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wednesday"
                    checked={selectedDays.wednesday}
                    onCheckedChange={(checked) => setSelectedDays({ ...selectedDays, wednesday: !!checked })}
                  />
                  <label
                    htmlFor="wednesday"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Thứ Tư
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="thursday"
                    checked={selectedDays.thursday}
                    onCheckedChange={(checked) => setSelectedDays({ ...selectedDays, thursday: !!checked })}
                  />
                  <label
                    htmlFor="thursday"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Thứ Năm
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="friday"
                    checked={selectedDays.friday}
                    onCheckedChange={(checked) => setSelectedDays({ ...selectedDays, friday: !!checked })}
                  />
                  <label
                    htmlFor="friday"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Thứ Sáu
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saturday"
                    checked={selectedDays.saturday}
                    onCheckedChange={(checked) => setSelectedDays({ ...selectedDays, saturday: !!checked })}
                  />
                  <label
                    htmlFor="saturday"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Thứ Bảy
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sunday"
                    checked={selectedDays.sunday}
                    onCheckedChange={(checked) => setSelectedDays({ ...selectedDays, sunday: !!checked })}
                  />
                  <label
                    htmlFor="sunday"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Chủ Nhật
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")} style={{ opacity: 1 }}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(startDate, "dd/MM/yyyy", { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date || new Date())
                      if (date && isBefore(endDate, date)) {
                        setEndDate(date)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")} style={{ opacity: 1 }}>
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(endDate, "dd/MM/yyyy", { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => setEndDate(date || addDays(startDate, 1))}
                    disabled={(date) => isBefore(date, startDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Khung giờ chiếu</Label>
          <Button variant="outline" size="sm" onClick={onAddTimeSlot} disabled={!selectedMovie}>
            <Plus className="h-4 w-4 mr-1" />
            Thêm khung giờ
          </Button>
        </div>
        {timeSlots.map((slot, index) => {
          const isOverlapping = overlappingSlots.includes(index)
          return (
            <div key={index} className={cn("flex items-center gap-3 p-3 border rounded-md", 
              isOverlapping ? "bg-red-50 border-red-200" : "bg-gray-50")}>
              <div className="flex-1">
                <Label htmlFor={`time-${index}`} className="text-xs mb-1 block">
                  Giờ bắt đầu {isOverlapping && <span className="text-red-600">(Trùng lặp)</span>}
                </Label>
                <Input
                  id={`time-${index}`}
                  type="time"
                  value={slot.start}
                  onChange={(e) => onUpdateTimeSlot(index, "start", e.target.value)}
                  className={cn("h-9", isOverlapping && "border-red-300 focus:border-red-500")}
                  style={{ opacity: 1 }}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`time-${index}`} className="text-xs mb-1 block">
                  Giờ kết thúc {isOverlapping && <span className="text-red-600">(Trùng lặp)</span>}
                </Label>
                <Input
                  id={`time-${index}`}
                  type="time"
                  value={slot.end}
                  onChange={(e) => onUpdateTimeSlot(index, "end", e.target.value)}
                  className={cn("h-9", isOverlapping && "border-red-300")}
                  disabled={true}
                  style={{ opacity: 1 }}
                />
              </div>
            <div className="flex-1">
              <Label htmlFor={`price-${index}`} className="text-xs mb-1 block">
                Điều chỉnh giá (+/-)
              </Label>
              <Input
                id={`price-${index}`}
                type="number"
                value={slot.priceAdjustment}
                onChange={(e) => onUpdateTimeSlot(index, "priceAdjustment", e.target.value)}
                className="h-9"
                step="10000"
                style={{ opacity: 1 }}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveTimeSlot(index)}
                disabled={timeSlots.length <= 1}
                className="h-9 w-9 text-gray-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
} 