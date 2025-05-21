"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, Edit } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useCreateUser, useUpdateUser } from "@/hooks/use-users"

export function UserDialog({ isOpen, onClose, user, mode, onSave, setDialogMode, setIsUserDialogOpen }) {
  const { toast } = useToast()
  const { createUser, isLoading: isCreating } = useCreateUser()
  const { updateUser, isLoading: isUpdating } = useUpdateUser()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
  })

  useEffect(() => {
    if (user && mode !== "add") {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "customer",
      })
    } else if (mode === "add") {
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "customer",
      })
    }
  }, [user, mode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (mode === "add") {
      createUser(formData, {
        onSuccess: () => {
          toast({
            title: "Thành công",
            description: "Thêm người dùng mới thành công",
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          })
          handleClose()
        },
        onError: (error) => {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi thêm người dùng",
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          })
        },
      })
    } else {
      updateUser(
        { id: user.id, userData: formData },
        {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: "Cập nhật người dùng thành công",
              icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            })
            handleClose()
          },
          onError: (error) => {
            toast({
              title: "Lỗi",
              description: error.message || "Có lỗi xảy ra khi cập nhật người dùng",
              icon: <XCircle className="h-5 w-5 text-red-500" />,
            })
          },
        }
      )
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "customer",
    })
    onClose()
  }

  const handleSwitchToEdit = () => {
    // Switch to edit mode without closing the dialog
    setDialogMode("edit")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Thêm người dùng mới" : mode === "edit" ? "Chỉnh sửa người dùng" : "Chi tiết người dùng"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Nhập thông tin người dùng mới"
              : mode === "edit"
              ? "Chỉnh sửa thông tin người dùng"
              : "Xem thông tin chi tiết người dùng"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={mode === "view"}
                required
                style={{
                  opacity: 1,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={mode === "view"}
                required
                style={{
                  opacity: 1,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || "--:--"}
                onChange={handleChange}
                disabled={mode === "view"}
                style={{
                  opacity: 1,
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select value={formData.role} onValueChange={handleRoleChange} disabled={mode === "view"} >
                <SelectTrigger style={{
                  opacity: 1,
                }}>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin" >Quản trị viên</SelectItem>
                  <SelectItem value="customer">Khách hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            {mode === "view" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 bg-white text-black hover:bg-gray-50"
                  onClick={handleSwitchToEdit}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </Button>
                <Button 
                  type="button" 
                  onClick={handleClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Đóng
                </Button>
              </>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                  className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {mode === "add" ? "Thêm" : "Cập nhật"}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 