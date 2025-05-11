"use client"

import { useState } from "react"
import { Edit, Trash2, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RoomDialog } from "./room-dialog"
import { toast } from "@/components/ui/use-toast"

export function RoomsTable({ rooms, cinemaId }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [dialogMode, setDialogMode] = useState("view")

  const handleDeleteClick = (id) => {
    setRoomToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    // In a real app, you would delete the room here
    console.log(`Deleting room with ID: ${roomToDelete}`)
    setIsDeleteDialogOpen(false)
    setRoomToDelete(null)
  }

  const handleViewRoom = (room) => {
    setSelectedRoom(room)
    setDialogMode("view")
    setIsRoomDialogOpen(true)
  }

  const handleEditRoom = (room) => {
    setSelectedRoom(room)
    setDialogMode("edit")
    setIsRoomDialogOpen(true)
  }

  const handleAddRoom = () => {
    setSelectedRoom(null)
    setDialogMode("add")
    setIsRoomDialogOpen(true)
  }

  const handleSaveRoom = (roomData) => {
    if (dialogMode === "add") {
      const formData = new FormData()
      formData.append("name", roomData.name)
      formData.append("capacity", roomData.capacity)
      formData.append("type", roomData.type)
      formData.append("row_count", roomData.rows)
      formData.append("column_count", roomData.columns)
      formData.append("is_active", roomData.is_active)
      formData.append("cinema_id", cinemaId)

      // Gọi API thêm phòng chiếu mới
      fetch("/api/rooms", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          toast({
            title: "Thành công",
            description: "Thêm phòng chiếu mới thành công",
            variant: "default",
          })
          setIsRoomDialogOpen(false)
          // Cập nhật lại danh sách phòng chiếu
          window.location.reload()
        })
        .catch((error) => {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi thêm phòng chiếu",
            variant: "destructive",
          })
        })
    } else if (dialogMode === "edit") {
      const formData = new FormData()
      formData.append("name", roomData.name)
      formData.append("capacity", roomData.capacity)
      formData.append("type", roomData.type)
      formData.append("row_count", roomData.rows)
      formData.append("column_count", roomData.columns)
      formData.append("is_active", roomData.is_active)

      // Gọi API cập nhật phòng chiếu
      fetch(`/api/rooms/${roomData.id}`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          toast({
            title: "Thành công",
            description: "Cập nhật phòng chiếu thành công",
            variant: "default",
          })
          setIsRoomDialogOpen(false)
          // Cập nhật lại danh sách phòng chiếu
          window.location.reload()
        })
        .catch((error) => {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi cập nhật phòng chiếu",
            variant: "destructive",
          })
        })
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center">Tên phòng</TableHead>
              <TableHead className="text-center">Sức chứa</TableHead>
              <TableHead className="text-center">Loại phòng</TableHead>
              <TableHead className="text-center">Số hàng</TableHead>
              <TableHead className="text-center">Số cột</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  Không có phòng chiếu nào
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room, index) => (
                <TableRow key={room.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-center" title={`Room ID: ${room.id}`}>{index + 1}</TableCell>
                  <TableCell className="font-medium text-blue-600 truncate max-w-[200px] text-center">{room.name}</TableCell>
                  <TableCell className="text-center">{room.capacity} ghế</TableCell>
                  <TableCell className="text-center">
                    {room.type === "2d"
                      ? "2D"
                      : room.type === "3d"
                        ? "3D"
                        : room.type === "4dx"
                          ? "4DX"
                          : room.type === "imax"
                            ? "IMAX"
                            : room.type}
                  </TableCell>
                  <TableCell className="text-center">{room.row_count}</TableCell>
                  <TableCell className="text-center">{room.column_count}</TableCell>
                  <TableCell className="text-center">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        room.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {room.is_active ? " Hoạt động" : "Dừng hoạt động"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-blue-600"
                        onClick={() => handleViewRoom(room)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Xem chi tiết</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-blue-600"
                        onClick={() => handleEditRoom(room)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Chỉnh sửa</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(room.id)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phòng chiếu này? Hành động này không thể hoàn tác.
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

      <RoomDialog
        isOpen={isRoomDialogOpen}
        onClose={() => setIsRoomDialogOpen(false)}
        room={selectedRoom}
        mode={dialogMode}
        onSave={handleSaveRoom}
        cinemaId={cinemaId}
      />
    </>
  )
}
