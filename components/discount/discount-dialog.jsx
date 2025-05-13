import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Edit, X, CalendarIcon, Tag, Percent, Users, Clock } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function DiscountDialog({
  open,
  onOpenChange,
  mode = 'view',
  discount,
  onSubmit,
  isLoading,
  onModeChange,
}) {
  const [formData, setFormData] = useState({
    code: '',
    percentage: '',
    is_active: false,
    start_date: '',
    end_date: '',
    usage_limit: '',
  })
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  useEffect(() => {
    if (discount && (mode === 'view' || mode === 'edit')) {
      console.log('Discount data:', discount) // Debug log
      const startDateObj = discount.start_date ? new Date(discount.start_date) : null
      const endDateObj = discount.end_date ? new Date(discount.end_date) : null
      
      setStartDate(startDateObj)
      setEndDate(endDateObj)
      setFormData({
        code: discount.code || '',
        percentage: discount.percentage || '',
        is_active: Boolean(discount.is_active),
        start_date: discount.start_date ? format(startDateObj, "yyyy-MM-dd") : '',
        end_date: discount.end_date ? format(endDateObj, "yyyy-MM-dd") : '',
        usage_limit: discount.usage_limit?.toString() || '0',
      })
    } else {
      setFormData({
        code: '',
        percentage: '',
        is_active: false,
        start_date: '',
        end_date: '',
        usage_limit: '0',
      })
      setStartDate(null)
      setEndDate(null)
    }
  }, [discount, mode])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form data before submit:', formData) // Debug log
    const formDataToSubmit = {
      ...formData,
      usage_limit: parseInt(formData.usage_limit) || 0,
      percentage: parseFloat(formData.percentage) || 0,
      is_active: Boolean(formData.is_active), // Ensure is_active is boolean
    }
    console.log('Form data after submit:', formDataToSubmit) // Debug log
    onSubmit(formDataToSubmit)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    console.log('Handling change for:', name, 'value:', value) // Debug log
    if (name === 'usage_limit') {
      const numValue = value === '' ? '0' : value.replace(/[^0-9]/g, '')
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }))
    } else {
      const formattedValue = name === 'start_date' || name === 'end_date' ? new Date(value).toDateString("vi-VN",
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }) : value
      setFormData((prev) => ({
        ...prev,
        [name]: formattedValue,
      }))
    }
  }

  const handleSwitchChange = (checked) => {
    console.log('Switch changed to:', checked) // Debug log
    setFormData((prev) => ({
      ...prev,
      is_active: Boolean(checked), // Ensure is_active is boolean
    }))
  }

  const handleClose = () => {
    setFormData({
      code: '',
      percentage: '',
      is_active: false,
      start_date: '',
      end_date: '',
      usage_limit: '',
    })
    onOpenChange(false)
  }

  const handleStartDateChange = (newDate) => {
    setStartDate(newDate)
    setFormData((prev) => ({
      ...prev,
      start_date: newDate ? format(newDate, "yyyy-MM-dd") : "",
    }))
  }

  const handleEndDateChange = (newDate) => {
    setEndDate(newDate)
    setFormData((prev) => ({
      ...prev,
      end_date: newDate ? format(newDate, "yyyy-MM-dd") : "",
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view'
              ? 'Chi tiết phiếu giảm giá'
              : mode === 'edit'
              ? 'Chỉnh sửa phiếu giảm giá'
              : 'Thêm phiếu giảm giá mới'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'view'
              ? 'Xem thông tin chi tiết của phiếu giảm giá'
              : 'Điền thông tin phiếu giảm giá vào form dưới đây'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="items-center gap-4">
              <Label htmlFor="code" className="flex items-center gap-2">
                <Tag className="h-4 w-4" /> Mã giảm giá
              </Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="mt-2"
                required
                style = {{opacity: 1}}
              />
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="percentage" className="flex items-center gap-2">
                <Percent className="h-4 w-4" /> Phần trăm giảm giá
              </Label>
              <Input
                id="percentage"
                name="percentage"
                type="number"
                value={formData.percentage}
                onChange={handleChange}
                disabled={mode === 'view'}
                className="mt-2"
                required
                style = {{opacity: 1}}
              />
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="start_date" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Ngày bắt đầu
              </Label>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                      disabled={mode === 'view'}
                      style={{ opacity: 1 }}
                    >
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                      <CalendarIcon className="mr-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={startDate} 
                      onSelect={handleStartDateChange} 
                      initialFocus 
                      disabled={(date) => endDate ? date > endDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="end_date" className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Ngày kết thúc
              </Label>
              <div className="mt-2">
                <Popover >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      disabled={mode === 'view'}
                      style={{ opacity: 1 }}
                    >
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                      <CalendarIcon className="mr-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar 
                      mode="single" 
                      selected={endDate} 
                      onSelect={handleEndDateChange} 
                      initialFocus 
                      disabled={(date) => startDate ? date < startDate : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="usage_limit" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Số lượng sử dụng
              </Label>
              <div className="mt-2">
                <Input
                  id="usage_limit"
                  name="usage_limit"
                  type="number"
                  min="0"
                  value={formData.usage_limit}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  required
                  className="w-full"
                  style={{ opacity: 1 }}
                />
              </div>
            </div>
            <div className="items-center gap-4">
              <Label htmlFor="is_active" className="flex items-center gap-2">
                <Tag className="h-4 w-4" /> Trạng thái
              </Label>
              <div className="mt-2 flex items-center">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={handleSwitchChange}
                  disabled={mode === 'view'}
                  style = {{opacity: 1, backgroundColor: formData.is_active ? 'green' : 'red'}}
                />
                <span className="ml-2 text-sm">
                  {formData.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between">
            {mode === 'view' ? (
              <>
                <Button
                  type="button"
                  onClick={() => onModeChange('edit')}
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
                  Đóng
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  <X className="mr-2 h-4 w-4" />
                  Hủy
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : mode === 'edit' ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 