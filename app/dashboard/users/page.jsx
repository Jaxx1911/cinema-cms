"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, XCircle } from "lucide-react"
import UserList from "@/components/users/user-list"
import UserFilter from "@/components/users/user-filter"
import { useToast } from "@/hooks/use-toast"
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/hooks/use-users"
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
  const [roleFilter, setRoleFilter] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const searchInputRef = useRef(null)

  // API hooks
  const { data: usersData, isLoading, error } = useUsers({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm,
    role: roleFilter !== "all" ? roleFilter : undefined,
  })
  const { createUser, isLoading: isCreating } = useCreateUser()
  const { updateUser, isLoading: isUpdating } = useUpdateUser()
  const { deleteUser, isLoading: isDeleting } = useDeleteUser()

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset to first page when search changes
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [roleFilter])

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
    if (selectedUser) {
      deleteUser(selectedUser.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          setSelectedUser(null)
        },
      })
    }
  }

  const handleSaveUser = async (formData) => {
    if (dialogMode === "edit" && selectedUser) {
      updateUser(
        { id: selectedUser.id, userData: formData },
        {
          onSuccess: () => {
            setIsUserDialogOpen(false)
            setSelectedUser(null)
          }
        }
      )
    } else {
      createUser(formData, {
        onSuccess: () => {
          setIsUserDialogOpen(false)
        }
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
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          searchInputRef={searchInputRef}
        />
        <UserList
          users={usersData?.body?.users || []}
          total={usersData?.body?.total || 0}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          loading={isLoading}
          error={error}
          handleViewUser={handleViewUser}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
        />
      </div>

      <UserDialog
        isOpen={isUserDialogOpen}
        onClose={handleDialogClose}
        mode={dialogMode}
        user={selectedUser}
        onSave={handleSaveUser}
        setDialogMode={setDialogMode}
        setIsUserDialogOpen={setIsUserDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng {selectedUser?.name} ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
