"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

// Mock data for revenue by date
const revenueData = [
  { date: "01/04/2023", tickets: 245, totalRevenue: 52000000, avgTicketPrice: 212245, topMovie: "Avengers: Endgame" },
  { date: "02/04/2023", tickets: 312, totalRevenue: 65000000, avgTicketPrice: 208333, topMovie: "The Dark Knight" },
  { date: "03/04/2023", tickets: 278, totalRevenue: 58000000, avgTicketPrice: 208633, topMovie: "Avengers: Endgame" },
  { date: "04/04/2023", tickets: 301, totalRevenue: 63000000, avgTicketPrice: 209302, topMovie: "Inception" },
  { date: "05/04/2023", tickets: 325, totalRevenue: 68000000, avgTicketPrice: 209230, topMovie: "Avengers: Endgame" },
  { date: "06/04/2023", tickets: 410, totalRevenue: 86000000, avgTicketPrice: 209756, topMovie: "Parasite" },
  { date: "07/04/2023", tickets: 520, totalRevenue: 110000000, avgTicketPrice: 211538, topMovie: "Avengers: Endgame" },
  { date: "08/04/2023", tickets: 480, totalRevenue: 102000000, avgTicketPrice: 212500, topMovie: "The Dark Knight" },
  { date: "09/04/2023", tickets: 350, totalRevenue: 74000000, avgTicketPrice: 211428, topMovie: "Joker" },
  { date: "10/04/2023", tickets: 290, totalRevenue: 61000000, avgTicketPrice: 210344, topMovie: "Inception" },
  { date: "11/04/2023", tickets: 310, totalRevenue: 65000000, avgTicketPrice: 209677, topMovie: "Avengers: Endgame" },
  { date: "12/04/2023", tickets: 340, totalRevenue: 72000000, avgTicketPrice: 211764, topMovie: "The Dark Knight" },
  { date: "13/04/2023", tickets: 320, totalRevenue: 68000000, avgTicketPrice: 212500, topMovie: "Parasite" },
  { date: "14/04/2023", tickets: 360, totalRevenue: 76000000, avgTicketPrice: 211111, topMovie: "Avengers: Endgame" },
]

export function RevenueTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const filteredData = revenueData.filter(
    (item) =>
      item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topMovie.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Tìm kiếm theo ngày hoặc phim..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Số vé bán</TableHead>
              <TableHead>Tổng doanh thu</TableHead>
              <TableHead>Giá vé trung bình</TableHead>
              <TableHead>Phim bán chạy nhất</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.date}</TableCell>
                  <TableCell>{item.tickets.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(item.totalRevenue)}</TableCell>
                  <TableCell>{formatCurrency(item.avgTicketPrice)}</TableCell>
                  <TableCell>{item.topMovie}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} trên{" "}
            {filteredData.length} kết quả
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Trang {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
