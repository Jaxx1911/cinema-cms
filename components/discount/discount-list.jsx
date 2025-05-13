'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useDiscounts } from '@/hooks/use-discount'
import { Eye, Edit, Trash2 } from 'lucide-react'

export default function DiscountList({
  handleViewDiscount,
  handleEditDiscount,
  handleDeleteDiscount,
  searchTerm,
}) {
  const { data: discounts, isLoading, error } = useDiscounts()
  console.log(discounts)
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const filteredDiscounts = discounts?.filter((discount) =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Mã giảm giá</TableHead>
              <TableHead className="text-center">Phần trăm giảm</TableHead>
              <TableHead className="text-center">Ngày bắt đầu</TableHead>
              <TableHead className="text-center">Ngày kết thúc</TableHead>
              <TableHead className="text-center">Số lượt sử dụng</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiscounts?.map((discount) => (
              <TableRow key={discount.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-blue-600">{discount.code}</TableCell>
                <TableCell className="text-center">{discount.percentage}%</TableCell>
                <TableCell className="text-center">
                  {new Date(discount.start_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-center">
                  {new Date(discount.end_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-center">
                  {discount.usage_limit}
                </TableCell>
                <TableCell className="text-center">
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    discount.is_active === true
                      ? "bg-green-100 text-green-800"
                      : discount.is_active === false
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {discount.is_active === true
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </div>
              </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => handleViewDiscount(discount)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem chi tiết</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => handleEditDiscount(discount)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Chỉnh sửa</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => handleDeleteDiscount(discount)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Xóa</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}