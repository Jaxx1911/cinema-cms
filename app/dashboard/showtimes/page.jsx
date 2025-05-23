"use client"

import { useState } from "react"
import { Plus, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShowtimeDialog } from "@/components/showtimes/showtime-dialog"
import { BatchShowtimeDialog } from "@/components/showtimes/batch-showtime-dialog"
import { BatchScheduleDialog } from "@/components/showtimes/batch-schedule-dialog"
import { ShowtimeFilter } from "@/components/showtimes/showtime-filter"
import { ShowtimeList } from "@/components/showtimes/showtime-list"
import { ShowtimeProvider } from "@/contexts/showtime-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function ShowtimesPage() {
  // Filter states
  const [selectedMovie, setSelectedMovie] = useState("all")
  const [selectedCinema, setSelectedCinema] = useState("all")
  const [selectedScreen, setSelectedScreen] = useState("all")
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0])

  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [showtimeToDelete, setShowtimeToDelete] = useState(null)
  const [isShowtimeDialogOpen, setIsShowtimeDialogOpen] = useState(false)
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [dialogMode, setDialogMode] = useState("view")
  const [isBatchScheduleDialogOpen, setIsBatchScheduleDialogOpen] = useState(false)

  const handleDeleteClick = (id) => {
    setShowtimeToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    // TODO: Implement delete showtime API call
    setIsDeleteDialogOpen(false)
    setShowtimeToDelete(null)
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

  const handleOpenBatchScheduleDialog = () => {
    setIsBatchScheduleDialogOpen(true)
  }

  const handleSaveShowtime = (showtimeData) => {
    // TODO: Implement save showtime API call
    console.log("Save showtime:", showtimeData)
  }

  const handleSaveBatchShowtime = (showtimeData) => {
    // TODO: Implement save batch showtime API call
    console.log("Save batch showtime:", showtimeData)
  }

  return (
    <ShowtimeProvider selectedCinema={selectedCinema}>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý suất chiếu</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={handleOpenBatchScheduleDialog}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Thêm theo lịch
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddShowtime}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm suất chiếu
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <ShowtimeFilter
            selectedMovie={selectedMovie}
            setSelectedMovie={setSelectedMovie}
            selectedCinema={selectedCinema}
            setSelectedCinema={setSelectedCinema}
            selectedScreen={selectedScreen}
            setSelectedScreen={setSelectedScreen}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
          <ShowtimeList
            selectedMovie={selectedMovie}
            selectedCinema={selectedCinema}
            selectedScreen={selectedScreen}
            startDate={startDate}
            endDate={endDate}
            onView={handleViewShowtime}
            onEdit={handleEditShowtime}
            onDelete={handleDeleteClick}
          />
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
        {/* Batch Schedule Dialog */}
        <BatchScheduleDialog
          isOpen={isBatchScheduleDialogOpen}
          onClose={() => setIsBatchScheduleDialogOpen(false)}
          onSave={handleSaveBatchShowtime}
        />
      </div>
    </ShowtimeProvider>
  )
}
