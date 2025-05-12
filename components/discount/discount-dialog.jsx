import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function DiscountDialog({
  open,
  onOpenChange,
  mode = 'view',
  discount,
  onSubmit,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountPercent: '',
    startDate: '',
    endDate: '',
    minOrderValue: '',
    maxDiscountValue: '',
    quantity: '',
  })

  useEffect(() => {
    if (discount && (mode === 'view' || mode === 'edit')) {
      setFormData({
        code: discount.code || '',
        description: discount.description || '',
        discountPercent: discount.discountPercent || '',
        startDate: discount.startDate ? new Date(discount.startDate).toISOString().split('T')[0] : '',
        endDate: discount.endDate ? new Date(discount.endDate).toISOString().split('T')[0] : '',
        minOrderValue: discount.minOrderValue || '',
        maxDiscountValue: discount.maxDiscountValue || '',
        quantity: discount.quantity || '',
      })
    } else {
      setFormData({
        code: '',
        description: '',
        discountPercent: '',
        startDate: '',
        endDate: '',
        minOrderValue: '',
        maxDiscountValue: '',
        quantity: '',
      })
    }
  }, [discount, mode])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view'
              ? 'Chi tiết phiếu giảm giá'
              : mode === 'edit'
              ? 'Chỉnh sửa phiếu giảm giá'
              : 'Thêm phiếu giảm giá mới'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Mã giảm giá
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="col-span-3"
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                disabled={mode === 'view'}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discountPercent" className="text-right">
                Phần trăm giảm giá
              </Label>
              <Input
                id="discountPercent"
                name="discountPercent"
                type="number"
                value={formData.discountPercent}
                onChange={handleChange}
                className="col-span-3"
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Ngày bắt đầu
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="col-span-3"
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Ngày kết thúc
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="col-span-3"
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="minOrderValue" className="text-right">
                Giá trị đơn hàng tối thiểu
              </Label>
              <Input
                id="minOrderValue"
                name="minOrderValue"
                type="number"
                value={formData.minOrderValue}
                onChange={handleChange}
                className="col-span-3"
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxDiscountValue" className="text-right">
                Giá trị giảm tối đa
              </Label>
              <Input
                id="maxDiscountValue"
                name="maxDiscountValue"
                type="number"
                value={formData.maxDiscountValue}
                onChange={handleChange}
                className="col-span-3"
                disabled={mode === 'view'}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Số lượng
              </Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                className="col-span-3"
                disabled={mode === 'view'}
                required
              />
            </div>
          </div>
          <DialogFooter>
            {mode !== 'view' && (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang xử lý...' : mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 