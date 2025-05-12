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
              <TableHead>Phần trăm giảm</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDiscounts?.map((discount) => (
              <TableRow key={discount._id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-blue-600">{discount.code}</TableCell>
                <TableCell>{discount.percentage}%</TableCell>
                <TableCell>
                  {new Date(discount.startDate).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  {new Date(discount.endDate).toLocaleDateString('vi-VN')}
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