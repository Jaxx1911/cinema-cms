"use client"

import { useState, useEffect } from "react"
import { Download, Search, ArrowUpDown, Info, Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { DatePicker } from "@/components/ui/date-picker"
import { useStatisticCombo } from "@/hooks/use-statistic"

// Màu cho biểu đồ tròn
const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#94a3b8"]

export default function ConcessionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "revenue", direction: "desc" })
  const [activeTab, setActiveTab] = useState("overview")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // Fetch data using the hook
  const { data: statisticData, isLoading, error } = useStatisticCombo(
    startDate ? startDate.toISOString() : null,
    endDate ? endDate.toISOString() : null
  )

  //Map api data
  const concessionData = statisticData?.body?.combos?.map(combo => ({
    id: combo.id,
    name: combo.name,
    description: combo.description,
    price: combo.price,
    quantity: combo.quantity,
    revenue: combo.revenue,
    percentageOfTotal: `${combo.percentage_of_total.toFixed(1)}%`,
  })) || []

  const totalRevenue = statisticData?.body?.summary?.total_revenue || 0
  const totalQuantity = statisticData?.body?.summary?.total_quantity_sold || 0

  const filteredConcessions = concessionData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sắp xếp dữ liệu
  const sortedConcessions = [...filteredConcessions].sort((a, b) => {
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

  // Dữ liệu cho biểu đồ tròn
  const pieChartData = concessionData.slice(0, 5).map((item) => ({
    name: item.name,
    value: item.revenue,
  }))

  // Thêm mục "Khác" cho các sản phẩm còn lại
  const otherRevenue = concessionData.slice(5).reduce((sum, item) => sum + item.revenue, 0)

  if (otherRevenue > 0) {
    pieChartData.push({
      name: "Khác",
      value: otherRevenue,
    })
  }

  // Dữ liệu cho biểu đồ cột
  const barChartData = concessionData
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 6)
    .map((item) => ({
      name: item.name.length > 10 ? item.name.substring(0, 10) + "..." : item.name,
      quantity: item.quantity,
    }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-2 shadow-sm">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
          <p className="text-sm text-gray-500">
            {((payload[0].value / totalRevenue) * 100).toFixed(1)}% tổng doanh thu
          </p>
        </div>
      )
    }
    return null
  }

  const BarChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">Số lượng: {payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  // Kiểm tra xem đã chọn cả hai ngày chưa
  const hasSelectedDates = startDate && endDate

  // Tìm combo phổ biến nhất (có số lượng bán cao nhất)
  const mostPopularCombo = concessionData.reduce((max, combo) => 
    combo.quantity > (max?.quantity || 0) ? combo : max, null
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Thống kê combo bắp nước</h2>
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
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          <div className="text-lg">Đang tải dữ liệu...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-red-600" />
          <div className="text-lg text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
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
                <CardTitle className="text-base font-medium text-gray-700">Số lượng đã bán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{totalQuantity.toLocaleString()} combo</span>
                  <span className="text-sm text-gray-500">Giá trị trung bình: {formatCurrency(totalQuantity > 0 ? totalRevenue / totalQuantity : 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-700">Combo phổ biến nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{mostPopularCombo?.name || "N/A"}</span>
                  <span className="text-sm text-gray-500">{mostPopularCombo?.quantity?.toLocaleString() || 0} đã bán</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Tổng quan
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Chi tiết
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Phân bố doanh thu theo combo</CardTitle>
                    <CardDescription>Tỷ lệ đóng góp vào tổng doanh thu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{fontSize: '12px'}}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Số lượng bán ra theo combo</CardTitle>
                    <CardDescription>Top 6 combo bán chạy nhất</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip content={<BarChartTooltip />} />
                          <Bar dataKey="quantity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Chi tiết doanh thu theo combo</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Tìm kiếm combo..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("name")}>
                          Tên combo
                          {sortConfig.key === "name" && (
                            <ArrowUpDown
                              className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("price")}>
                          Giá bán
                          {sortConfig.key === "price" && (
                            <ArrowUpDown
                              className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </TableHead>
                        <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("quantity")}>
                          Số lượng
                          {sortConfig.key === "quantity" && (
                            <ArrowUpDown
                              className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </TableHead>
                        <TableHead className="cursor-pointer hover:text-blue-600" onClick={() => handleSort("revenue")}>
                          Doanh thu
                          {sortConfig.key === "revenue" && (
                            <ArrowUpDown
                              className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:text-blue-600"
                          onClick={() => handleSort("percentageOfTotal")}
                        >
                          Tỷ lệ
                          {sortConfig.key === "percentageOfTotal" && (
                            <ArrowUpDown
                              className={`ml-1 inline h-4 w-4 ${sortConfig.direction === "asc" ? "rotate-180" : ""}`}
                            />
                          )}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedConcessions.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-blue-600">{item.name}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{item.quantity.toLocaleString()}</TableCell>
                          <TableCell>{formatCurrency(item.revenue)}</TableCell>
                          <TableCell>{item.percentageOfTotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Info className="mr-1 h-4 w-4" />
                  <span>Tỷ lệ được tính dựa trên phần trăm đóng góp vào tổng doanh thu bắp nước.</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
