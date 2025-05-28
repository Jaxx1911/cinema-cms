"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetShowtimes } from "@/hooks/use-showtime"
import { useShowtimeData } from "@/contexts/showtime-context"
import { useState, useEffect } from "react"

export function ShowtimeList({
  selectedMovie,
  selectedCinema,
  selectedScreen,
  startDate,
  endDate,
  onView,
  onEdit,
  onDelete,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Get filter data from context
  const { newMovies, incomingMovies, cinemas, screens } = useShowtimeData()

  // Fetch showtimes using hook
  const { data: showtimesData, isLoading, error, refetch } = useGetShowtimes(
    selectedMovie === "all" ? null : selectedMovie,
    selectedCinema === "all" ? null : selectedCinema,
    selectedScreen === "all" ? null : selectedScreen,
    startDate,
    endDate,
    currentPage,
    itemsPerPage
  )

  const showtimes = showtimesData?.data || []
  const totalShowtimes = showtimesData?.total_count || 0

  useEffect(() => {
    if (selectedCinema !== "all") {
      refetch()
    }
  }, [currentPage, selectedMovie, selectedCinema, selectedScreen, startDate, endDate, refetch])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedMovie, selectedCinema, selectedScreen, startDate, endDate])

  const totalPages = Math.ceil(totalShowtimes / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return <div className="text-center py-4">Đang tải...</div>
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Có lỗi xảy ra khi tải dữ liệu</div>
  }

  if (showtimes.length === 0) {
    return <div className="text-center py-4">Không có suất chiếu nào</div>
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-left">Phim</TableHead>
              <TableHead className="text-center">Phòng</TableHead>
              <TableHead className="text-center">Ngày</TableHead>
              <TableHead className="text-center">Giờ bắt đầu</TableHead>
              <TableHead className="text-center">Giờ kết thúc</TableHead>
              <TableHead className="text-center">Giá vé</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showtimes.map((showtime) => {
              const movie = newMovies.find((m) => m.id === showtime.movie_id) || incomingMovies.find((m) => m.id === showtime.movie_id)
              const cinema = cinemas.find((c) => c.id === selectedCinema)
              const screen = screens.find((s) => s.id === showtime.room_id)
              const startTime = new Date(showtime.start_time)
              const endTime = new Date(showtime.end_time)
              return (
                <TableRow key={showtime.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600">{movie?.title || "N/A"}</TableCell>
                  <TableCell className="text-center">{screen?.name.replace("Room", "") || "N/A"}</TableCell>
                  <TableCell className="text-center">
                    {format(startTime, "dd/MM/yyyy", { locale: vi })}
                  </TableCell>
                  <TableCell className="text-center">{format(startTime, "HH:mm")}</TableCell>
                  <TableCell className="text-center">{format(endTime, "HH:mm")}</TableCell>
                  <TableCell className="text-center">{showtime.price.toLocaleString("vi-VN")} VND</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-blue-600"
                        onClick={() => onView(showtime)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem chi tiết</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-blue-600"
                        onClick={() => onEdit(showtime)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(showtime.id)}
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
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          {showtimes.length > 0 ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, showtimes.length)} của ${totalShowtimes} suất chiếu` : "Không có suất chiếu nào"}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
} 