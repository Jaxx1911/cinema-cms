"use client"

import { useGetCombos } from "@/hooks/use-combo"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Search } from "lucide-react"
import Image from "next/image"

export default function ComboList({
  handleViewCombo,
  handleEditCombo,
  handleDeleteCombo,
  searchTerm,
}) {
  const { data: combos, isLoading, error } = useGetCombos()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  const filteredCombos = combos.filter((combo) => {
    return combo.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên combo</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-center">Giá</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCombos?.map((combo) => (
              <TableRow key={combo.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="relative h-12 w-12 overflow-hidden rounded">
                    <Image
                      src={combo.banner_url || "/placeholder.svg?height=48&width=48"}
                      alt={combo.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-blue-600">{combo.name}</TableCell>
                <TableCell className="max-w-md truncate">{combo.description}</TableCell>
                <TableCell className="text-center">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(combo.price)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => handleViewCombo(combo)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem chi tiết</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => handleEditCombo(combo)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Chỉnh sửa</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => handleDeleteCombo(combo)}
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
