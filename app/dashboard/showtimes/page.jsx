"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, Search, Calendar } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockShowtimes, mockCinemas, mockScreens, mockMovies } from "@/lib/mock-data"
import { ShowtimeDialog } from "@/components/showtimes/showtime-dialog"

export default function ShowtimesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCinema, setSelectedCinema] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showtimeToDelete, setShowtimeToDelete] = useState(null)
  const [showtimes, setShowtimes] = useState(mockShowtimes)

  // Showtime dialog state
  const [isShowtimeDialogOpen, setIsShowtimeDialogOpen] = useState(false)
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [dialogMode, setDialogMode] = useState("view") // view, edit, add

  const filteredShowtimes = showtimes.filter((showtime) => {
    const movie = mockMovies.find((m) => m.id === showtime.movieId)
    const cinema = mockCinemas.find((c) => c.id === showtime.cinemaId)
    const screen = mockScreens.find((s) => s.id === showtime.screenId)

    const matchesSearch =
      movie?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cinema?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCinema = selectedCinema === "all" || showtime.cinemaId === Number.parseInt(selectedCinema)

    const showtimeDate = new Date(showtime.startTime).toISOString().split("T")[0]
    const matchesDate = showtimeDate === selectedDate

    return matchesSearch && matchesCinema && matchesDate
  })

  const handleDeleteClick = (id) => {
    setShowtimeToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setShowtimes(showtimes.filter((showtime) => showtime.id !== showtimeToDelete))
    setIsDeleteDialogOpen(false)
    setShowtimeToDelete(null)
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }

  const handleViewShowtime = (showtime) => {
    setSelectedShowtime(showtime)
    setDialogMode("view")
    setIsShowtimeDialogOpen(true)
  }

  const handleEditShowtime = (showtime) => {
    setSelectedShowtime(showtime)
    setDialogMode("edit")
    setIsShowtimeDialogOpen(true)
  }

  const handleAddShowtime = () => {
    setSelectedShowtime(null)
    setDialogMode("add")
    setIsShowtimeDialogOpen(true)
  }

  const handleSaveShowtime = (showtimeData) => {
    if (dialogMode === "add") {
      // Add new showtime
      setShowtimes([...showtimes, showtimeData])
    } else if (dialogMode === "edit") {
      // Update existing showtime
      setShowtimes(showtimes.map((showtime) => (showtime.id === showtimeData.id ? showtimeData : showtime)))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý suất chiếu</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Thêm hàng loạt
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddShowtime}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm suất chiếu
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm suất chiếu..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-[180px]">
              <Select value={selectedCinema} onValueChange={setSelectedCinema}>
                <SelectTrigger className="border-gray-200 bg-white">
                  <SelectValue placeholder="Chọn rạp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả rạp</SelectItem>
                  {mockCinemas.map((cinema) => (
                    <SelectItem key={cinema.id} value={cinema.id.toString()}>
                      {cinema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[180px] border-gray-200"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Phim</TableHead>
                <TableHead>Rạp</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Thời gian bắt đầu</TableHead>
                <TableHead>Thời gian kết thúc</TableHead>
                <TableHead>Giá vé</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShowtimes.map((showtime) => {
                const movie = mockMovies.find((m) => m.id === showtime.movieId)
                const cinema = mockCinemas.find((c) => c.id === showtime.cinemaId)
                const screen = mockScreens.find((s) => s.id === showtime.screenId)

                return (
                  <TableRow key={showtime.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{showtime.id}</TableCell>
                    <TableCell className="font-medium text-blue-600">{movie?.title}</TableCell>
                    <TableCell>{cinema?.name}</TableCell>
                    <TableCell>{screen?.name}</TableCell>
                    <TableCell>{formatTime(showtime.startTime)}</TableCell>
                    <TableCell>{formatTime(showtime.endTime)}</TableCell>
                    <TableCell>{showtime.price.toLocaleString("vi-VN")} VND</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-blue-600"
                          onClick={() => handleViewShowtime(showtime)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem chi tiết</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-blue-600"
                          onClick={() => handleEditShowtime(showtime)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(showtime.id)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa suất chiếu này? Hành động này không thể hoàn tác.
            </DialogDescription>
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

      {/* Showtime Dialog for View/Edit/Add */}
      <ShowtimeDialog
        isOpen={isShowtimeDialogOpen}
        onClose={() => setIsShowtimeDialogOpen(false)}
        showtime={selectedShowtime}
        mode={dialogMode}
        onSave={handleSaveShowtime}
      />
    </div>
  )
}
