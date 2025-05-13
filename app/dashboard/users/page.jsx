"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, XCircle } from "lucide-react"
import UserList from "@/components/users/user-list"
import UserFilter from "@/components/users/user-filter"
import { useToast } from "@/hooks/use-toast"
import { mockUsers } from "@/lib/mock-data"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserDialog } from "@/components/users/user-dialog"

export default function UsersPage() {
  const { toast } = useToast()
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("view") // view, edit, add
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const searchInputRef = useRef(null)

  // Mock data and loading states - replace with actual API calls
  const users = mockUsers
  const isLoading = false
  const error = null

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setDialogMode("view")
    setIsUserDialogOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setDialogMode("edit")
    setIsUserDialogOpen(true)
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setDialogMode("add")
    setIsUserDialogOpen(true)
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Replace with actual delete API call
    console.log(`Deleting user with ID: ${selectedUser.id}`)
    toast({
      title: "Thành công",
      description: "Xóa người dùng thành công",
      variant: "default",
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    })
    setIsDeleteDialogOpen(false)
  }

  const handleSaveUser = async (formData) => {
    try {
      // Replace with actual API calls
      if (dialogMode === "edit") {
        console.log("Updating user:", formData)
        toast({
          title: "Thành công",
          description: "Cập nhật người dùng thành công",
          variant: "default",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        })
      } else {
        console.log("Creating user:", formData)
        toast({
          title: "Thành công",
          description: "Thêm người dùng mới thành công",
          variant: "default",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        })
      }
      setIsUserDialogOpen(false)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra",
        variant: "destructive",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      })
    }
  }

  const handleDialogClose = () => {
    setIsUserDialogOpen(false)
    setSelectedUser(null)
    setDialogMode("view")
  }

  const handleModeChange = (newMode) => {
    setDialogMode(newMode)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý người dùng</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <UserFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchInputRef={searchInputRef}
        />
        <UserList
          users={users}
          loading={isLoading}
          error={error}
          handleViewUser={handleViewUser}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
          searchTerm={searchTerm}
        />
      </div>

      <UserDialog
        isOpen={isUserDialogOpen}
        onClose={handleDialogClose}
        mode={dialogMode}
        user={selectedUser}
        onSave={handleSaveUser}
        onModeChange={handleModeChange}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.name}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
