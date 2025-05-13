'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, CheckCircle2, XCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import DiscountList from '@/components/discount/discount-list'
import { DiscountDialog } from '@/components/discount/discount-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount,
} from '@/hooks/use-discount'

export default function DiscountsPage() {
  const { toast } = useToast()
  const [selectedDiscount, setSelectedDiscount] = useState(null)
  const [dialogMode, setDialogMode] = useState('view') // view, edit, add
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false)
  const searchInputRef = useRef(null)

  const { createDiscount, isLoading: isCreating } = useCreateDiscount()
  const { updateDiscount, isLoading: isUpdating } = useUpdateDiscount()
  const { deleteDiscount, isLoading: isDeleting } = useDeleteDiscount()

  const handleViewDiscount = (discount) => {
    setSelectedDiscount(discount)
    setDialogMode('view')
    setIsDiscountDialogOpen(true)
  }

  const handleEditDiscount = (discount) => {
    setSelectedDiscount(discount)
    setDialogMode('edit')
    setIsDiscountDialogOpen(true)
  }

  const handleAddDiscount = () => {
    setSelectedDiscount(null)
    setDialogMode('add')
    setIsDiscountDialogOpen(true)
  }

  const handleDeleteDiscount = (discount) => {
    setSelectedDiscount(discount)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    deleteDiscount(selectedDiscount.id, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Xóa phiếu giảm giá thành công",
          variant: "default",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        })
        setIsDeleteDialogOpen(false)
      },
      onError: (error) => {
        toast({
          title: "Lỗi",
          description: error.message || "Có lỗi xảy ra khi xóa phiếu giảm giá",
          variant: "destructive",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        })
      }
    })
  }

  const handleSubmit = (formData) => {
    console.log("formData in handleSubmit: ", formData)
    try {
      if (dialogMode === 'add') {
        createDiscount(formData, {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: "Thêm mới phiếu giảm giá thành công",
              variant: "default",
              icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            })
            setIsDiscountDialogOpen(false)
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
      } else if (dialogMode === 'edit') {
        updateDiscount({ id: selectedDiscount.id, data: formData }, {
          onSuccess: () => {
            toast({
              title: "Thành công",
              description: "Cập nhật phiếu giảm giá thành công",
              variant: "default",
              icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            })
            setIsDiscountDialogOpen(false)
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
    setIsDiscountDialogOpen(false)
    setSelectedDiscount(null)
    setDialogMode('view')
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý phiếu giảm giá</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddDiscount}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm phiếu giảm giá
        </Button>
      </div>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="relative flex mb-4 gap-2">
          <div>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Tìm kiếm theo mã giảm giá..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <DiscountList
          handleViewDiscount={handleViewDiscount}
          handleEditDiscount={handleEditDiscount}
          handleDeleteDiscount={handleDeleteDiscount}
          searchTerm={searchTerm}
        />
      </div>

      <DiscountDialog
        open={isDiscountDialogOpen}
        onOpenChange={handleDialogClose}
        mode={dialogMode}
        discount={selectedDiscount}
        onSubmit={handleSubmit}
        onModeChange={setDialogMode}
        isLoading={isCreating || isUpdating}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phiếu giảm giá này không? Hành động này
              không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 