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
    // In a real app, you would save the room data here
    console.log("Saving room:", roomData)
    setIsRoomDialogOpen(false)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên phòng</TableHead>
              <TableHead>Sức chứa</TableHead>
              <TableHead>Loại phòng</TableHead>
              <TableHead>Số hàng</TableHead>
              <TableHead>Số cột</TableHead>
              <TableHead>Trạng thái</TableHead>
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
              rooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell className="font-medium text-blue-600">{room.name}</TableCell>
                  <TableCell>{room.capacity} ghế</TableCell>
                  <TableCell>
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
                  <TableCell>{room.rows}</TableCell>
                  <TableCell>{room.columns}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        room.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {room.status === "active" ? "Hoạt động" : "Bảo trì"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
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
      />
    </>
  )
}
