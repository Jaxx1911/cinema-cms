"use client"

import { useState } from "react"
import { Download, Search, ArrowUpDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

// Dữ liệu mẫu cho combo bắp nước
const concessionData = [
  {
    id: 1,
    name: "Combo Đôi",
    description: "1 bắp lớn + 2 nước lớn",
    price: 120000,
    quantity: 3500,
    revenue: 420000000,
    percentageOfTotal: "28%",
  },
  {
    id: 2,
    name: "Combo Gia Đình",
    description: "1 bắp lớn + 4 nước vừa + 1 snack",
    price: 200000,
    quantity: 2200,
    revenue: 440000000,
    percentageOfTotal: "30%",
  },
  {
    id: 3,
    name: "Combo Một Người",
    description: "1 bắp vừa + 1 nước vừa",
    price: 85000,
    quantity: 2800,
    revenue: 238000000,
    percentageOfTotal: "16%",
  },
  {
    id: 4,
    name: "Bắp Caramel Lớn",
    description: "Bắp rang caramel size lớn",
    price: 65000,
    quantity: 1800,
    revenue: 117000000,
    percentageOfTotal: "8%",
  },
  {
    id: 5,
    name: "Hotdog + Nước",
    description: "1 hotdog + 1 nước vừa",
    price: 75000,
    quantity: 1500,
    revenue: 112500000,
    percentageOfTotal: "7.5%",
  },
  {
    id: 6,
    name: "Nachos + Phô Mai",
    description: "Nachos với sốt phô mai",
    price: 70000,
    quantity: 1200,
    revenue: 84000000,
    percentageOfTotal: "5.5%",
  },
  {
    id: 7,
    name: "Nước Ngọt Lớn",
    description: "Coca-Cola/Pepsi/Sprite size lớn",
    price: 35000,
    quantity: 2000,
    revenue: 70000000,
    percentageOfTotal: "4.5%",
  },
  {
    id: 8,
    name: "Trà Sữa",
    description: "Trà sữa trân châu đường đen",
    price: 45000,
    quantity: 800,
    revenue: 36000000,
    percentageOfTotal: "2.5%",
  },
]

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
    name: item.name.length > 15 ? item.name.substring(0, 15) + "..." : item.name,
    quantity: item.quantity,
  }))

// Dữ liệu theo rạp
const cinemaData = [
  { name: "CGV Vincom Center", revenue: 320000000, percentage: "21.5%" },
  { name: "Galaxy Nguyễn Du", revenue: 250000000, percentage: "16.8%" },
  { name: "Lotte Cinema Nowzone", revenue: 280000000, percentage: "18.8%" },
  { name: "BHD Star Bitexco", revenue: 230000000, percentage: "15.4%" },
  { name: "CGV Aeon Mall Tân Phú", revenue: 310000000, percentage: "20.8%" },
  { name: "Lotte Cinema Cantavil", revenue: 100000000, percentage: "6.7%" },
]

// Màu cho biểu đồ tròn
const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#94a3b8"]

export default function ConcessionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [sortConfig, setSortConfig] = useState({ key: "revenue", direction: "desc" })
  const [activeTab, setActiveTab] = useState("overview")

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

  const handleExport = () => {
    alert("Xuất báo cáo thống kê combo bắp nước")
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Tính tổng doanh thu và số lượng
  const totalRevenue = sortedConcessions.reduce((sum, item) => sum + item.revenue, 0)
  const totalQuantity = sortedConcessions.reduce((sum, item) => sum + item.quantity, 0)
  const avgOrderValue = totalRevenue / totalQuantity

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Thống kê combo bắp nước</h2>
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
              <span className="text-sm font-medium text-green-600">+18.2% so với kỳ trước</span>
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
              <span className="text-sm text-gray-500">Giá trị trung bình: {formatCurrency(avgOrderValue)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-700">Combo phổ biến nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">{sortedConcessions[0]?.name}</span>
              <span className="text-sm text-gray-500">{sortedConcessions[0]?.quantity.toLocaleString()} đã bán</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="by-cinema" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Theo rạp
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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
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

        <TabsContent value="by-cinema" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Doanh thu bắp nước theo rạp</CardTitle>
              <CardDescription>So sánh doanh thu bắp nước giữa các rạp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead>Rạp</TableHead>
                      <TableHead>Doanh thu</TableHead>
                      <TableHead>Tỷ lệ</TableHead>
                      <TableHead>Biểu đồ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cinemaData.map((cinema, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{cinema.name}</TableCell>
                        <TableCell>{formatCurrency(cinema.revenue)}</TableCell>
                        <TableCell>{cinema.percentage}</TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: cinema.percentage }}></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
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
    </div>
  )
}
