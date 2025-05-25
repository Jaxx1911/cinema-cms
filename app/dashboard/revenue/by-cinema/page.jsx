"use client"

import { useState } from "react"
import { Download, Search, ArrowUpDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// Dữ liệu mẫu cho doanh thu theo rạp
const cinemaRevenueData = [
  {
    id: 1,
    name: "CGV Vincom Center",
    totalRevenue: 2500000000,
    tickets: 12000,
    avgTicketPrice: 208333,
    concessionRevenue: 750000000,
    totalScreenings: 320,
    occupancyRate: "82%",
  },
  {
    id: 2,
    name: "Galaxy Nguyễn Du",
    totalRevenue: 1800000000,
    tickets: 8500,
    avgTicketPrice: 211765,
    concessionRevenue: 520000000,
    totalScreenings: 280,
    occupancyRate: "75%",
  },
  {
    id: 3,
    name: "Lotte Cinema Nowzone",
    totalRevenue: 2100000000,
    tickets: 10000,
    avgTicketPrice: 210000,
    concessionRevenue: 620000000,
    totalScreenings: 300,
    occupancyRate: "78%",
  },
  {
    id: 4,
    name: "BHD Star Bitexco",
    totalRevenue: 1950000000,
    tickets: 9200,
    avgTicketPrice: 211957,
    concessionRevenue: 580000000,
    totalScreenings: 290,
    occupancyRate: "76%",
  },
  {
    id: 5,
    name: "CGV Aeon Mall Tân Phú",
    totalRevenue: 2300000000,
    tickets: 11000,
    avgTicketPrice: 209091,
    concessionRevenue: 680000000,
    totalScreenings: 310,
    occupancyRate: "80%",
  },
  {
    id: 6,
    name: "Lotte Cinema Cantavil",
    totalRevenue: 1700000000,
    tickets: 8000,
    avgTicketPrice: 212500,
    concessionRevenue: 500000000,
    totalScreenings: 270,
    occupancyRate: "74%",
  },
  {
    id: 7,
    name: "CGV Crescent Mall",
    totalRevenue: 2200000000,
    tickets: 10500,
    avgTicketPrice: 209524,
    concessionRevenue: 650000000,
    totalScreenings: 305,
    occupancyRate: "79%",
  },
  {
    id: 8,
    name: "BHD Star Phạm Hùng",
    totalRevenue: 1850000000,
    tickets: 8800,
    avgTicketPrice: 210227,
    concessionRevenue: 550000000,
    totalScreenings: 285,
    occupancyRate: "77%",
  },
]

// Dữ liệu cho biểu đồ
const chartData = cinemaRevenueData
  .sort((a, b) => b.totalRevenue - a.totalRevenue)
  .map((cinema) => ({
    name: cinema.name.length > 20 ? cinema.name.substring(0, 20) + "..." : cinema.name,
    revenue: cinema.totalRevenue,
    concession: cinema.concessionRevenue,
  }))

export default function CinemaRevenuePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [sortConfig, setSortConfig] = useState({ key: "totalRevenue", direction: "desc" })

  const filteredCinemas = cinemaRevenueData.filter((cinema) =>
    cinema.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sắp xếp dữ liệu
  const sortedCinemas = [...filteredCinemas].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1
    }
    return 0
  })

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "desc" ? "asc" : "desc"
    setSortConfig({ key, direction })
  }

  const handleExport = () => {
    alert("Xuất báo cáo doanh thu theo rạp")
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatYAxis = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`
    }
    return value
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-blue-600">Vé: {formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-green-600">Bắp nước: {formatCurrency(payload[1].value)}</p>
          <p className="text-sm font-medium">Tổng: {formatCurrency(payload[0].value + payload[1].value)}</p>
        </div>
      )
    }
    return null
  }

  // Tính tổng doanh thu
  const totalRevenue = sortedCinemas.reduce((sum, cinema) => sum + cinema.totalRevenue, 0)
  const totalConcessionRevenue = sortedCinemas.reduce((sum, cinema) => sum + cinema.concessionRevenue, 0)
  const totalTickets = sortedCinemas.reduce((sum, cinema) => sum + cinema.tickets, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Doanh thu theo rạp</h2>
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
              <span className="text-sm font-medium text-green-600">+12.5% so với kỳ trước</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-700">Doanh thu bắp nước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalConcessionRevenue)}</span>
              <span className="text-sm text-gray-500">
                {((totalConcessionRevenue / totalRevenue) * 100).toFixed(1)}% tổng doanh thu
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-700">Rạp có doanh thu cao nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{sortedCinemas[0]?.name}</span>
              <span className="text-sm text-gray-500">{formatCurrency(sortedCinemas[0]?.totalRevenue)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-gray-900">Biểu đồ doanh thu theo rạp</CardTitle>
            <CardDescription>So sánh doanh thu vé và bắp nước</CardDescription>
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
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Doanh thu vé" stackId="a" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="concession" name="Doanh thu bắp nước" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Chi tiết doanh thu theo rạp</h3>
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
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("name")}>
                  Rạp
                  {sortConfig.key === "name" && (
                    <ArrowUpDown
                      className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("totalRevenue")}>
                  Doanh thu vé
                  {sortConfig.key === "totalRevenue" && (
                    <ArrowUpDown
                      className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort("concessionRevenue")}
                >
                  Doanh thu bắp nước
                  {sortConfig.key === "concessionRevenue" && (
                    <ArrowUpDown
                      className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("tickets")}>
                  Số vé bán
                  {sortConfig.key === "tickets" && (
                    <ArrowUpDown
                      className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("totalScreenings")}>
                  Số suất chiếu
                  {sortConfig.key === "totalScreenings" && (
                    <ArrowUpDown
                      className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("occupancyRate")}>
                  Tỷ lệ lấp đầy
                  {sortConfig.key === "occupancyRate" && (
                    <ArrowUpDown
                      className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCinemas.map((cinema) => (
                <TableRow key={cinema.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600">{cinema.name}</TableCell>
                  <TableCell>{formatCurrency(cinema.totalRevenue)}</TableCell>
                  <TableCell>{formatCurrency(cinema.concessionRevenue)}</TableCell>
                  <TableCell>{cinema.tickets.toLocaleString()}</TableCell>
                  <TableCell>{cinema.totalScreenings}</TableCell>
                  <TableCell>{cinema.occupancyRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Info className="mr-1 h-4 w-4" />
          <span>
            Doanh thu vé được tính dựa trên giá vé đã bán. Doanh thu bắp nước bao gồm tất cả các sản phẩm ăn uống được
            bán tại rạp.
          </span>
        </div>
      </div>
    </div>
  )
}
