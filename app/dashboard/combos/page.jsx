"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, XCircle } from "lucide-react"
import ComboList from "@/components/combos/combo-list"
import { ComboDialog } from "@/components/combos/combo-dialog"
import { useToast } from "@/hooks/use-toast"
import { useGetCombos, useCreateCombo, useUpdateCombo, useDeleteCombo } from "@/hooks/use-combo"
import ComboFilter from "@/components/combos/combo-filter"
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

export default function CombosPage() {
  const { toast } = useToast()
  const [selectedCombo, setSelectedCombo] = useState(null)
  const [isComboDialogOpen, setIsComboDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("view") // view, edit, add
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const searchInputRef = useRef(null)

  const { data: combos, isLoading, error, refetch } = useGetCombos()
  const { createCombo, isLoading: isCreating, isError: isCreateError } = useCreateCombo()
  const { updateCombo, isLoading: isUpdating, isError: isUpdateError } = useUpdateCombo()
  const { deleteCombo, isLoading: isDeleting } = useDeleteCombo()

  const handleViewCombo = (combo) => {
    setSelectedCombo(combo)
    setDialogMode("view")
    setIsComboDialogOpen(true)
  }

  const handleEditCombo = (combo) => {
    setSelectedCombo(combo)
    setDialogMode("edit")
    setIsComboDialogOpen(true)
  }

  const handleAddCombo = () => {
    setSelectedCombo(null)
    setDialogMode("add")
    setIsComboDialogOpen(true)
  }

  const handleDeleteCombo = (combo) => {
    setSelectedCombo(combo)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    deleteCombo(selectedCombo.id, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Xóa combo thành công",
          variant: "default",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        })
        setIsDeleteDialogOpen(false)
      },
      onError: (error) => {
        toast({
          title: "Lỗi",
          description: error.message || "Có lỗi xảy ra khi xóa combo",
          variant: "destructive",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        })
      }
    })
  }

  const handleSaveCombo = async (formData) => {
    try {
      if (dialogMode === "edit") {
        updateCombo(
          { id: selectedCombo.id, data: formData },
          {
            onSuccess: () => {
              toast({
                title: "Thành công",
                description: "Cập nhật combo thành công",
                variant: "default",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
              })
              setIsComboDialogOpen(false)
            },
            onError: (error) => {
              toast({
                title: "Lỗi",
                description: error.message || "Có lỗi xảy ra",
                variant: "destructive",
                icon: <XCircle className="h-5 w-5 text-red-500" />,
              })
            }
          }
        )
      } else {
        createCombo(formData, {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: "Thêm combo mới thành công",
              variant: "default",
              icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            })
            setIsComboDialogOpen(false)
          },
          onError: (error) => {
            toast({
              title: "Lỗi",
              description: error.message || "Có lỗi xảy ra",
              variant: "destructive",
              icon: <XCircle className="h-5 w-5 text-red-500" />,
            })
          }
        })
      }
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
    setIsComboDialogOpen(false)
    setSelectedCombo(null)
    setDialogMode("view")
  }

  const handleModeChange = (newMode) => {
    setDialogMode(newMode)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý combo</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCombo}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm combo
        </Button>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <ComboFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchInputRef={searchInputRef}
        />
        <ComboList
          combos={combos}
          loading={isLoading}
          error={error}
          handleViewCombo={handleViewCombo}
          handleEditCombo={handleEditCombo}
          handleDeleteCombo={handleDeleteCombo}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchInputRef={searchInputRef}
        />
      </div>

      <ComboDialog
        isOpen={isComboDialogOpen}
        onClose={handleDialogClose}
        mode={dialogMode}
        combo={selectedCombo}
        onSave={handleSaveCombo}
        onModeChange={handleModeChange}
        isLoading={isCreating || isUpdating}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa combo "{selectedCombo?.name}"? Hành động này không thể hoàn tác.
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
