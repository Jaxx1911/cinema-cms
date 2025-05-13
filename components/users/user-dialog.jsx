"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, X, User, Mail, Phone, Lock, Calendar, MapPin } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"

const initialFormData = {
  full_name: "",
  email: "",
  phone: "",
  password: "",
  date_of_birth: null,
  address: "",
  role: "user",
}

export function UserDialog({
  isOpen,
  onClose,
  mode,
  user,
  onSave,
  onModeChange,
}) {
  const [formData, setFormData] = useState(initialFormData)
  const [date, setDate] = useState(null)

  useEffect(() => {
    if (user && (mode === "view" || mode === "edit")) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth) : null,
        address: user.address || "",
        role: user.role || "user",
      })
      setDate(user.date_of_birth ? new Date(user.date_of_birth) : null)
    } else if (!user || mode === "add") {
      setFormData(initialFormData)
      setDate(null)
    }
  }, [user, mode, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    setFormData((prev) => ({
      ...prev,
      date_of_birth: selectedDate,
    }))
  }

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") {
          formDataToSend.append(key, formData[key])
        }
      })

      await onSave(formDataToSend)
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const handleClose = () => {
    setFormData(initialFormData)
    setDate(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "view"
              ? "Chi tiết người dùng"
              : mode === "edit"
              ? "Chỉnh sửa thông tin người dùng"
              : "Thêm người dùng mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "Xem thông tin chi tiết của người dùng"
              : "Điền thông tin người dùng vào form dưới đây"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Họ và tên
            </Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={mode === "view"}
              style={{ opacity: 1 }}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={mode === "view"}
              style={{ opacity: 1 }}
              placeholder="Nhập địa chỉ email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Số điện thoại
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={mode === "view"}
              style={{ opacity: 1 }}
              placeholder="Nhập số điện thoại"
            />
          </div>

          {mode !== "view" && (
            <div className="grid gap-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Mật khẩu
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={mode === "edit" ? "Để trống nếu không muốn thay đổi" : "Nhập mật khẩu"}
                style={{ opacity: 1 }}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Ngày sinh
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  disabled={mode === "view"}
                >
                  {date ? (
                    format(date, "PPP", { locale: vi })
                  ) : (
                    <span>Chọn ngày sinh</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={mode === "view"}
                  locale={vi}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Địa chỉ
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={mode === "view"}
              style={{ opacity: 1 }}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role" className="flex items-center gap-2">
              <User className="h-4 w-4" /> Vai trò
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange({ target: { name: "role", value } })}
              disabled={mode === "view"}
              style={{ opacity: 1 }}
            >
              <SelectTrigger id="role" style={{ opacity: 1 }}>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Người dùng</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          {mode === "view" ? (
            <>
              <Button
                type="button"
                onClick={() => onModeChange("edit")}
                className="bg-white text-black border border-gray-300"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <X className="mr-2 h-4 w-4" />
                Đóng
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="bg-white text-black border border-gray-300"
              >
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {mode === "edit" ? "Cập nhật" : "Thêm mới"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 