"use client"

import { useState, useEffect } from "react"
import { Edit, Chair } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function RoomDialog({ isOpen, onClose, room, mode = "view", onSave }) {
  const isViewMode = mode === "view"
  const isAddMode = mode === "add"
  const isEditMode = mode === "edit"

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    type: "2d",
    row_count: "",
    column_count: "",
    is_active: true
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      capacity: "",
      type: "2d",
      row_count: "",
      column_count: "",
      is_active: true
    })
  }

  useEffect(() => {
    if (isAddMode) {
      resetForm()
    } else if (room && isViewMode) {
      setFormData({
        name: room.name || "",
        capacity: room.capacity || "",
        type: room.type || "2d",
        row_count: room.row_count || "",
        column_count: room.column_count || "",
        is_active: room.is_active 
      })
    }
  }, [room, isViewMode, isAddMode])

  const handleClose = () => {
    if (isAddMode) {
      resetForm()
    }
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const dialogTitle = isAddMode ? "Thêm phòng chiếu mới" : "Chi tiết phòng chiếu"

  if (isAddMode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-none">
          <DialogHeader>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết về phòng chiếu mới
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên phòng</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên phòng"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Sức chứa</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  placeholder="Nhập sức chứa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Loại phòng</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Chọn loại phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2d">2D</SelectItem>
                    <SelectItem value="3d">3D</SelectItem>
                    <SelectItem value="4dx">4DX</SelectItem>
                    <SelectItem value="imax">IMAX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rows">Số hàng</Label>
                  <Input
                    id="rows"
                    name="rows"
                    type="number"
                    value={formData.rows}
                    onChange={handleChange}
                    required
                    placeholder="Nhập số hàng"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="columns">Số cột</Label>
                  <Input
                    id="columns"
                    name="columns"
                    type="number"
                    value={formData.columns}
                    onChange={handleChange}
                    required
                    placeholder="Nhập số cột"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="is_active">Trạng thái</Label>
                <Select
                  value={formData.is_active}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="is_active">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Hoạt động</SelectItem>
                    <SelectItem value="false">Dừng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit">
                Thêm phòng
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-none">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8 pt-2">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Thông tin phòng chiếu
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              onClick={() => onSave({ ...room, mode: "edit" })}
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Tên phòng
                  </dt>
                  <dd className="text-lg text-gray-900">{room?.name}</dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </dt>
                  <dd>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        room?.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {room?.is_active  ? "Hoạt động" : "Dừng hoạt động"}
                    </div>
                  </dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Sức chứa
                  </dt>
                  <div className="flex items-center gap-2">
                    <Chair className="h-5 w-5 text-muted-foreground" />
                    <dd className="text-lg text-gray-900">
                      {room?.capacity} ghế
                    </dd>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Loại phòng
                  </dt>
                  <dd className="text-lg text-gray-900">
                    {room?.type === "2d"
                      ? "2D"
                      : room?.type === "3d"
                        ? "3D"
                        : room?.type === "4dx"
                          ? "4DX"
                          : room?.type === "imax"
                            ? "IMAX"
                            : room?.type}
                  </dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Số hàng
                  </dt>
                  <dd className="text-lg text-gray-900">{room?.rows}</dd>
                </div>
                <div className="border rounded-lg p-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Số cột
                  </dt>
                  <dd className="text-lg text-gray-900">{room?.columns}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 