"use client"

import { useState } from "react"
import { Download, Search, ArrowUpDown, Info, Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { DatePicker } from "@/components/ui/date-picker"
import { useStatisticMovie } from "@/hooks/use-statistic"

export default function MovieRevenuePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "totalRevenue", direction: "desc" })
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // Fetch data using the hook
  const { data: statisticData, isLoading, error } = useStatisticMovie(
    startDate ? startDate.toISOString() : null,
    endDate ? endDate.toISOString() : null
  )

  // Map API data
  const movieRevenueData = statisticData?.body?.movies?.map(movie => ({
    id: movie.movie_id,
    title: movie.movie_title,
    totalRevenue: movie.tickets_sold * movie.average_price,
    tickets: movie.tickets_sold,
    avgTicketPrice: movie.average_price,
    screenings: movie.showtime_count,
    occupancyRate: `${movie.occupancy_rate.toFixed(1)}%`,
  })) || []

  const totalRevenue = statisticData?.body?.summary?.total_revenue || 0
  const totalTickets = statisticData?.body?.summary?.total_tickets_sold || 0

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

  // Dữ liệu cho biểu đồ
  const chartData = movieRevenueData
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10)
    .map((movie) => ({
      name: movie.title.length > 15 ? movie.title.substring(0, 15) + "..." : movie.title,
      revenue: movie.totalRevenue,
    }))

  // Tìm phim có doanh thu cao nhất
  const topRevenueMovie = movieRevenueData.reduce((max, movie) => 
    movie.totalRevenue > (max?.totalRevenue || 0) ? movie : max, null
  )

  // Kiểm tra xem đã chọn cả hai ngày chưa
  const hasSelectedDates = startDate && endDate

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Doanh thu theo phim</h2>
        <div className="flex gap-2">
          <DatePicker
            date={startDate}
            onDateChange={setStartDate}
            placeholder="Ngày bắt đầu"
            className="w-[200px]"
          />
          <DatePicker
            date={endDate}
            onDateChange={setEndDate}
            placeholder="Ngày kết thúc"
            className="w-[200px]"
          />
        </div>
      </div>

      {!hasSelectedDates ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="text-lg text-gray-600">Vui lòng chọn ngày để tiếp tục</div>
            <div className="text-sm text-gray-500 mt-2">Chọn ngày bắt đầu và ngày kết thúc để xem thống kê</div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <div className="text-lg">Đang tải dữ liệu...</div>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-12 w-12 text-red-600" />
            <div className="text-lg text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-700">Tổng doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</span>
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
                  <span className="text-sm text-gray-500">Giá trung bình: {formatCurrency(totalTickets > 0 ? totalRevenue / totalTickets : 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-700">Phim có doanh thu cao nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{topRevenueMovie?.title || "N/A"}</span>
                  <span className="text-sm text-gray-500">{formatCurrency(topRevenueMovie?.totalRevenue || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Biểu đồ doanh thu theo phim</CardTitle>
              <CardDescription>Top 10 phim có doanh thu cao nhất</CardDescription>
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
        </>
      )}
    </div>
  )
}
