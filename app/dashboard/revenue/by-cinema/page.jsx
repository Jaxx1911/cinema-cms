"use client"

import { useState } from "react"
import { Download, Search, ArrowUpDown, Info, Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { DatePicker } from "@/components/ui/date-picker"
import { useStatisticCinema } from "@/hooks/use-statistic"
import { CinemaInvoicesDialog } from "@/components/revenue/payment-cinema-list"

export default function CinemaRevenuePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "totalRevenue", direction: "desc" })
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch data using the hook
  const { data: statisticData, isLoading, error } = useStatisticCinema(
    startDate ? startDate.toISOString() : null,
    endDate ? endDate.toISOString() : null
  )

  // Map API data
  const cinemaRevenueData = statisticData?.body?.cinemas?.map(cinema => ({
    id: cinema.cinema_id,
    name: cinema.cinema_name,
    totalRevenue: cinema.ticket_revenue + cinema.combo_revenue,
    ticketRevenue: cinema.ticket_revenue,
    concessionRevenue: cinema.combo_revenue,
    tickets: cinema.tickets_sold,
    avgTicketPrice: cinema.tickets_sold > 0 ? cinema.ticket_revenue / cinema.tickets_sold : 0,
    totalScreenings: cinema.showtime_count,
    occupancyRate: `${cinema.occupancy_rate.toFixed(1)}%`,
  })) || []

  const totalRevenue = statisticData?.body?.summary?.total_revenue || 0
  const totalTicketRevenue = statisticData?.body?.summary?.total_ticket_revenue || 0
  const totalConcessionRevenue = statisticData?.body?.summary?.total_combo_revenue || 0

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

  // Dữ liệu cho biểu đồ
  const chartData = cinemaRevenueData
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .map((cinema) => ({
      name: cinema.name.length > 20 ? cinema.name.substring(0, 20) + "..." : cinema.name,
      revenue: cinema.ticketRevenue,
      concession: cinema.concessionRevenue,
    }))

  // Tìm rạp có doanh thu cao nhất
  const topRevenueCinema = cinemaRevenueData.reduce((max, cinema) => 
    cinema.totalRevenue > (max?.totalRevenue || 0) ? cinema : max, null
  )

  // Kiểm tra xem đã chọn cả hai ngày chưa
  const hasSelectedDates = startDate && endDate

  const handleCinemaClick = (cinema) => {
    setSelectedCinema(cinema)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Doanh thu theo rạp</h2>
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
                <CardTitle className="text-base font-medium text-gray-700">Doanh thu bắp nước</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalConcessionRevenue)}</span>
                  <span className="text-sm text-gray-500">
                    {totalRevenue > 0 ? ((totalConcessionRevenue / totalRevenue) * 100).toFixed(1) : 0}% tổng doanh thu
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
                  <span className="text-2xl font-bold text-gray-900">{topRevenueCinema?.name || "N/A"}</span>
                  <span className="text-sm text-gray-500">{formatCurrency(topRevenueCinema?.totalRevenue || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Biểu đồ doanh thu theo rạp</CardTitle>
              <CardDescription>So sánh doanh thu vé và bắp nước</CardDescription>
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
                    <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("ticketRevenue")}>
                      Doanh thu vé
                      {sortConfig.key === "ticketRevenue" && (
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
                    <TableRow 
                      key={cinema.id} 
                      className="hover:bg-gray-50 cursor-pointer" 
                      onClick={() => handleCinemaClick(cinema)}
                    >
                      <TableCell className="font-medium text-blue-600">{cinema.name}</TableCell>
                      <TableCell>{formatCurrency(cinema.ticketRevenue)}</TableCell>
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
        </>
      )}

      <CinemaInvoicesDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        cinema={selectedCinema}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  )
}
