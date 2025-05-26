"use client"

import { useState } from "react"
import { Download, Search, ArrowUpDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// Dữ liệu mẫu cho doanh thu theo phim
const movieRevenueData = [
  {
    id: 1,
    title: "Avengers: Endgame",
    totalRevenue: 1250000000,
    tickets: 5840,
    avgTicketPrice: 214041,
    screenings: 120,
    occupancyRate: "85%",
  },
  {
    id: 2,
    title: "The Dark Knight",
    totalRevenue: 980000000,
    tickets: 4650,
    avgTicketPrice: 210752,
    screenings: 95,
    occupancyRate: "78%",
  },
  {
    id: 3,
    title: "Parasite",
    totalRevenue: 720000000,
    tickets: 3400,
    avgTicketPrice: 211765,
    screenings: 85,
    occupancyRate: "72%",
  },
  {
    id: 4,
    title: "Joker",
    totalRevenue: 680000000,
    tickets: 3200,
    avgTicketPrice: 212500,
    screenings: 80,
    occupancyRate: "70%",
  },
  {
    id: 5,
    title: "Inception",
    totalRevenue: 850000000,
    tickets: 4000,
    avgTicketPrice: 212500,
    screenings: 90,
    occupancyRate: "75%",
  },
  {
    id: 6,
    title: "Spider-Man: No Way Home",
    totalRevenue: 920000000,
    tickets: 4300,
    avgTicketPrice: 213953,
    screenings: 100,
    occupancyRate: "80%",
  },
  {
    id: 7,
    title: "Dune",
    totalRevenue: 520000000,
    tickets: 2500,
    avgTicketPrice: 208000,
    screenings: 70,
    occupancyRate: "65%",
  },
  {
    id: 8,
    title: "Black Panther",
    totalRevenue: 780000000,
    tickets: 3700,
    avgTicketPrice: 210811,
    screenings: 85,
    occupancyRate: "74%",
  },
]

// Dữ liệu cho biểu đồ
const chartData = movieRevenueData
  .sort((a, b) => b.totalRevenue - a.totalRevenue)
  .slice(0, 10)
  .map((movie) => ({
    name: movie.title.length > 15 ? movie.title.substring(0, 15) + "..." : movie.title,
    revenue: movie.totalRevenue,
  }))

export default function MovieRevenuePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [sortConfig, setSortConfig] = useState({ key: "totalRevenue", direction: "desc" })

  const filteredMovies = movieRevenueData.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sắp xếp dữ liệu
  const sortedMovies = [...filteredMovies].sort((a, b) => {
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
    alert("Xuất báo cáo doanh thu theo phim")
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
          <p className="text-sm">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  // Tính tổng doanh thu
  const totalRevenue = sortedMovies.reduce((sum, movie) => sum + movie.totalRevenue, 0)
  const totalTickets = sortedMovies.reduce((sum, movie) => sum + movie.tickets, 0)
  const avgTicketPrice = totalRevenue / totalTickets

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Doanh thu theo phim</h2>
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
              <span className="text-sm font-medium text-green-600">+15.3% so với kỳ trước</span>
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
              <span className="text-2xl font-bold text-gray-900">{sortedMovies[0]?.title}</span>
              <span className="text-sm text-gray-500">{formatCurrency(sortedMovies[0]?.totalRevenue)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-gray-900">Biểu đồ doanh thu theo phim</CardTitle>
            <CardDescription>Top 10 phim có doanh thu cao nhất</CardDescription>
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
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatYAxis}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Chi tiết doanh thu theo phim</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm phim..."
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
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("title")}>
                  Phim
                  {sortConfig.key === "title" && (
                    <ArrowUpDown
                      className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("totalRevenue")}>
                  Doanh thu
                  {sortConfig.key === "totalRevenue" && (
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
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("avgTicketPrice")}>
                  Giá vé trung bình
                  {sortConfig.key === "avgTicketPrice" && (
                    <ArrowUpDown
                      className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </TableHead>
                <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("screenings")}>
                  Số suất chiếu
                  {sortConfig.key === "screenings" && (
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
              {sortedMovies.map((movie) => (
                <TableRow key={movie.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600">{movie.title}</TableCell>
                  <TableCell>{formatCurrency(movie.totalRevenue)}</TableCell>
                  <TableCell>{movie.tickets.toLocaleString()}</TableCell>
                  <TableCell>{formatCurrency(movie.avgTicketPrice)}</TableCell>
                  <TableCell>{movie.screenings}</TableCell>
                  <TableCell>{movie.occupancyRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <Info className="mr-1 h-4 w-4" />
          <span>
            Doanh thu được tính dựa trên giá vé đã bán. Tỷ lệ lấp đầy là tỷ lệ phần trăm ghế đã bán trên tổng số ghế có
            sẵn.
          </span>
        </div>
      </div>
    </div>
  )
}
