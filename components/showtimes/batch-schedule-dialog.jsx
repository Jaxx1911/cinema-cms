"use client"

import { useState, useEffect } from "react"
import { X, Calendar, AlertCircle, Info, Plus, Copy, Check } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { format, addDays, addMinutes, parse, isBefore, eachDayOfInterval } from "date-fns"
import { vi } from "date-fns/locale"
import { mockCinemas, mockScreens, mockMovies } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BatchScheduleDialog({ isOpen, onClose, onSave }) {
  // State cho form
  const [selectedMovie, setSelectedMovie] = useState("")
  const [selectedCinema, setSelectedCinema] = useState("")
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
  const [timeSlots, setTimeSlots] = useState([{ time: "10:00", priceAdjustment: "0" }])
  const [previewShowtimes, setPreviewShowtimes] = useState([])
  const [availableScreens, setAvailableScreens] = useState([])
  const [activeTab, setActiveTab] = useState("schedule")

  // Lấy thông tin phim đã chọn
  const selectedMovieDetails = selectedMovie
    ? mockMovies.find((movie) => movie.id === Number.parseInt(selectedMovie))
    : null

  // Cập nhật danh sách phòng chiếu khi chọn rạp
  useEffect(() => {
    if (selectedCinema) {
      const screens = mockScreens.filter((screen) => screen.cinemaId === Number.parseInt(selectedCinema))
      setAvailableScreens(screens)
      setSelectedScreens([]) // Reset selected screens when cinema changes
    } else {
      setAvailableScreens([])
      setSelectedScreens([])
    }
  }, [selectedCinema])

  // Cập nhật xem trước khi thay đổi các tham số
  useEffect(() => {
    if (selectedMovie && selectedScreens.length > 0 && startDate && endDate) {
      generatePreview()
    }
  }, [selectedMovie, selectedScreens, startDate, endDate, scheduleType, selectedDays, timeSlots])

  // Thêm một khung giờ mới
  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { time: "12:00", priceAdjustment: "0" }])
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
    if (selectedScreens.length === availableScreens.length) {
      setSelectedScreens([])
    } else {
      setSelectedScreens(availableScreens.map((screen) => screen.id))
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

  // Tạo xem trước các suất chiếu
  const generatePreview = () => {
    if (!selectedMovieDetails) return

    const preview = []
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    for (const day of days) {
      if (isDaySelected(day)) {
        for (const screen of selectedScreens) {
          for (const slot of timeSlots) {
            const screenObj = availableScreens.find((s) => s.id === screen)
            if (!screenObj) continue

            const dateStr = format(day, "yyyy-MM-dd")
            const startTime = parse(`${dateStr} ${slot.time}`, "yyyy-MM-dd HH:mm", new Date())
            const endTime = addMinutes(startTime, selectedMovieDetails.duration)

            // Tính giá vé (giá cơ bản + điều chỉnh)
            const price = Number.parseInt(basePrice) + Number.parseInt(slot.priceAdjustment || "0")

            preview.push({
              id: `preview-${dateStr}-${screen}-${slot.time}`,
              movieId: Number.parseInt(selectedMovie),
              cinemaId: Number.parseInt(selectedCinema),
              screenId: screen,
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

    // Chuyển đổi dữ liệu xem trước thành định dạng suất chiếu thực tế
    const newShowtimes = previewShowtimes.map((preview, index) => ({
      id: Date.now() + index, // Tạo ID duy nhất
      movieId: preview.movieId,
      cinemaId: preview.cinemaId,
      screenId: preview.screenId,
      startTime: preview.startTime.toISOString(),
      endTime: preview.endTime.toISOString(),
      price: preview.price,
      availableSeats: 100, // Giá trị mặc định
    }))

    // Gọi callback để thông báo đã thêm suất chiếu mới
    for (const newShowtime of newShowtimes) {
      onSave(newShowtime)
    }

    setShowSuccessMessage(true)
    setTimeout(() => {
      setShowSuccessMessage(false)
      onClose()
    }, 2000)
  }

  // Sao chép lịch từ một ngày sang các ngày khác
  const copySchedule = () => {
    if (timeSlots.length === 0) {
      setError("Vui lòng thêm ít nhất một khung giờ để sao chép")
      return
    }

    // Hiện tại đã có sẵn các khung giờ, không cần thêm logic sao chép
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Thiết lập lịch</TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedMovie || selectedScreens.length === 0}>
              Xem trước ({previewShowtimes.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
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
                  <div className="flex items-center justify-between">
                    <Label>Phòng chiếu</Label>
                    {availableScreens.length > 0 && (
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={handleToggleAllScreens}>
                        {selectedScreens.length === availableScreens.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                      </Button>
                    )}
                  </div>
                  {availableScreens.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2 border rounded-md p-3 max-h-40 overflow-y-auto">
                      {availableScreens.map((screen) => (
                        <div key={screen.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`screen-${screen.id}`}
                            checked={selectedScreens.includes(screen.id)}
                            onCheckedChange={() => handleScreenToggle(screen.id)}
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
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Loại lịch trình</Label>
                  <Select value={scheduleType} onValueChange={setScheduleType}>
                    <SelectTrigger>
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
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
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
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
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
                <Button variant="outline" size="sm" onClick={addTimeSlot}>
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm khung giờ
                </Button>
              </div>
                {timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
                    <div className="flex-1">
                      <Label htmlFor={`time-${index}`} className="text-xs mb-1 block">
                        Giờ bắt đầu
                      </Label>
                      <Input
                        id={`time-${index}`}
                        type="time"
                        value={slot.time}
                        onChange={(e) => updateTimeSlot(index, "time", e.target.value)}
                        className="h-9"
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
                        onChange={(e) => updateTimeSlot(index, "priceAdjustment", e.target.value)}
                        className="h-9"
                        step="10000"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTimeSlot(index)}
                        disabled={timeSlots.length <= 1}
                        className="h-9 w-9 text-gray-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={copySchedule}
                  className="flex items-center"
                  disabled={!selectedMovie || selectedScreens.length === 0}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Xem trước lịch chiếu
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 py-4">
            {previewShowtimes.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Xem trước lịch chiếu ({previewShowtimes.length} suất chiếu)</h3>
                  <div className="text-sm text-gray-500">
                    {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 sticky top-0">
                        <TableRow>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Phòng chiếu</TableHead>
                          <TableHead>Giờ bắt đầu</TableHead>
                          <TableHead>Giờ kết thúc</TableHead>
                          <TableHead>Giá vé (VND)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewShowtimes.map((showtime) => (
                          <TableRow key={showtime.id}>
                            <TableCell>{format(showtime.date, "dd/MM/yyyy")}</TableCell>
                            <TableCell>{showtime.screenName}</TableCell>
                            <TableCell>{format(showtime.startTime, "HH:mm")}</TableCell>
                            <TableCell>{format(showtime.endTime, "HH:mm")}</TableCell>
                            <TableCell>{showtime.price.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Thông tin</AlertTitle>
                  <AlertDescription>
                    Tất cả các suất chiếu sẽ được thêm vào hệ thống khi bạn nhấn nút "Thêm suất chiếu". Vui lòng kiểm
                    tra kỹ trước khi xác nhận.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">Không có suất chiếu nào được tạo</div>
                <Button variant="outline" onClick={() => setActiveTab("schedule")}>
                  Quay lại thiết lập lịch
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            disabled={previewShowtimes.length === 0}
          >
            Thêm {previewShowtimes.length > 0 ? `${previewShowtimes.length} suất chiếu` : "suất chiếu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
