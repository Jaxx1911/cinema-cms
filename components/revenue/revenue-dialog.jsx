"use client"

import { useState, useEffect } from "react"
import { X, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockCinemas } from "@/lib/mock-data"
import { RevenueChart } from "@/components/revenue/revenue-chart"
import { RevenueByMovieChart } from "@/components/revenue/revenue-by-movie-chart"
import { RevenueTable } from "@/components/revenue/revenue-table"

export function RevenueDialog({ isOpen, onClose, cinemaId = "all" }) {
  const [selectedCinema, setSelectedCinema] = useState(cinemaId)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (cinemaId) {
      setSelectedCinema(cinemaId)
    }
  }, [cinemaId])

  const handleExport = () => {
    alert("Xuất báo cáo doanh thu")
  }

  // Mock revenue data
  const revenueData = {
    total: "5,200,000,000",
    tickets: "24,532",
    avgTicketPrice: "212,000",
    comparison: "+20.1%",
    topMovie: "Avengers: Endgame",
    topMovieRevenue: "1,250,000,000",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} size="lg">
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Thống kê doanh thu</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-900"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Lọc:</span>
              </div>

              <Select value={selectedCinema} onValueChange={setSelectedCinema}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Chọn rạp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả rạp</SelectItem>
                  {mockCinemas.map((cinema) => (
                    <SelectItem key={cinema.id} value={cinema.id.toString()}>
                      {cinema.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="h-9 w-[150px]">
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

            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-700">Tổng doanh thu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{revenueData.total} VND</span>
                  <span className="text-sm font-medium text-green-600">{revenueData.comparison} so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-700">Vé đã bán</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{revenueData.tickets} vé</span>
                  <span className="text-sm text-gray-500">Giá trung bình: {revenueData.avgTicketPrice} VND</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium text-gray-700">Phim có doanh thu cao nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{revenueData.topMovie}</span>
                  <span className="text-sm text-gray-500">{revenueData.topMovieRevenue} VND</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="bg-white">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="by-movie"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Theo phim
              </TabsTrigger>
              <TabsTrigger value="by-date" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Theo ngày
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="border-0 shadow-sm">
                <CardHeader>
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
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <RevenueChart period={selectedPeriod} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-movie">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Doanh thu theo phim</CardTitle>
                  <CardDescription>Top 10 phim có doanh thu cao nhất</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <RevenueByMovieChart />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="by-date">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Doanh thu theo ngày</CardTitle>
                  <CardDescription>Chi tiết doanh thu theo từng ngày</CardDescription>
                </CardHeader>
                <CardContent>
                  <RevenueTable />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
