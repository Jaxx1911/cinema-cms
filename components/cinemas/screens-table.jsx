"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Trash2, Eye } from "lucide-react"
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

export function ScreensTable({ screens, cinemaId }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [screenToDelete, setScreenToDelete] = useState(null)

  const handleDeleteClick = (id) => {
    setScreenToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    // In a real app, you would delete the screen here
    console.log(`Deleting screen with ID: ${screenToDelete}`)
    setIsDeleteDialogOpen(false)
    setScreenToDelete(null)
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
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {screens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  Không có phòng chiếu nào
                </TableCell>
              </TableRow>
            ) : (
              screens.map((screen) => (
                <TableRow key={screen.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{screen.id}</TableCell>
                  <TableCell className="font-medium text-blue-600">{screen.name}</TableCell>
                  <TableCell>{screen.capacity} ghế</TableCell>
                  <TableCell>
                    {screen.type === "2d"
                      ? "2D"
                      : screen.type === "3d"
                        ? "3D"
                        : screen.type === "4dx"
                          ? "4DX"
                          : screen.type === "imax"
                            ? "IMAX"
                            : screen.type}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        screen.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {screen.status === "active" ? "Hoạt động" : "Bảo trì"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/dashboard/cinemas/${cinemaId}/screens/${screen.id}`}>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Xem chi tiết</span>
                        </Button>
                      </Link>
                      <Link href={`/dashboard/cinemas/${cinemaId}/screens/${screen.id}/edit`}>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Chỉnh sửa</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(screen.id)}
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
    </>
  )
}
