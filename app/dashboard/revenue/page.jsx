"use client"

import { useState } from "react"
import { Download, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RevenueChart } from "@/components/revenue/revenue-chart"
import { RevenueDialog } from "@/components/revenue/revenue-dialog"

// Mock data for revenue summary
const revenueSummary = [
  {
    id: 1,
    cinema: "CGV Vincom Center",
    totalRevenue: 1250000000,
    tickets: 5840,
    avgTicketPrice: 214041,
    topMovie: "Avengers: Endgame",
  },
  {
    id: 2,
    cinema: "Galaxy Nguyễn Du",
    totalRevenue: 980000000,
    tickets: 4650,
    avgTicketPrice: 210752,
    topMovie: "The Dark Knight",
  },
  {
    id: 3,
    cinema: "Lotte Cinema Nowzone",
    totalRevenue: 1120000000,
    tickets: 5320,
    avgTicketPrice: 210526,
    topMovie: "Avengers: Endgame",
  },
  {
    id: 4,
    cinema: "BHD Star Bitexco",
    totalRevenue: 850000000,
    tickets: 4020,
    avgTicketPrice: 211442,
    topMovie: "Inception",
  },
  {
    id: 5,
    cinema: "CGV Aeon Mall Tân Phú",
    totalRevenue: 1000000000,
    tickets: 4700,
    avgTicketPrice: 212766,
    topMovie: "Parasite",
  },
]

export default function RevenuePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isRevenueDialogOpen, setIsRevenueDialogOpen] = useState(false)
  const [selectedCinemaId, setSelectedCinemaId] = useState("all")

  const filteredRevenue = revenueSummary.filter(
    (item) =>
      item.cinema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.topMovie.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExport = () => {
    alert("Xuất báo cáo doanh thu")
  }

  const handleViewDetails = (cinemaId) => {
    setSelectedCinemaId(cinemaId.toString())
    setIsRevenueDialogOpen(true)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Calculate totals
  const totalRevenue = revenueSummary.reduce((sum, item) => sum + item.totalRevenue, 0)
  const totalTickets = revenueSummary.reduce((sum, item) => sum + item.tickets, 0)
  const avgTicketPrice = totalRevenue / totalTickets

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Thống kê doanh thu</h2>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-700">Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</span>
              <span className="text-sm font-medium text-green-600">+20.1% so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-700">Vé đã bán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{totalTickets.toLocaleString()} vé</span>
              <span className="text-sm text-gray-500">Giá trung bình: {formatCurrency(avgTicketPrice)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-700">Phim có doanh thu cao nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">Avengers: Endgame</span>
              <span className="text-sm text-gray-500">{formatCurrency(1250000000)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-gray-900">Biểu đồ doanh thu</CardTitle>
            <CardDescription>
              Doanh thu theo{" "}
              {selectedPeriod === "week"
                ? "tuần"
                : selectedPeriod === "month"
                  ? "tháng"
                  : selectedPeriod === "quarter"
                    ? "quý"
                    : "năm"}
            </CardDescription>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <RevenueChart period={selectedPeriod} />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Doanh thu theo rạp</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm rạp..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Rạp phim</TableHead>
                <TableHead>Tổng doanh thu</TableHead>
                <TableHead>Số vé bán</TableHead>
                <TableHead>Giá vé trung bình</TableHead>
                <TableHead>Phim bán chạy nhất</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRevenue.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.cinema}</TableCell>
                  <TableCell>{formatCurrency(item.totalRevenue)}</TableCell>
                  <TableCell>{item.tickets.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(item.avgTicketPrice)}</TableCell>
                  <TableCell>{item.topMovie}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Revenue Detail Dialog */}
      <RevenueDialog
        isOpen={isRevenueDialogOpen}
        onClose={() => setIsRevenueDialogOpen(false)}
        cinemaId={selectedCinemaId}
      />
    </div>
  )
}
