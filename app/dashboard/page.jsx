import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
      </div>
      <DashboardStats />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Doanh thu
          </TabsTrigger>
          <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Vé
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Tổng quan</CardTitle>
                <CardDescription>Doanh thu trong 30 ngày qua</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3 border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Bán vé gần đây</CardTitle>
                <CardDescription>Các giao dịch bán vé mới nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="revenue" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Thống kê doanh thu</CardTitle>
              <CardDescription>Phân tích chi tiết doanh thu theo thời gian và rạp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <p>Biểu đồ thống kê doanh thu sẽ hiển thị ở đây</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tickets" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Thống kê vé</CardTitle>
              <CardDescription>Phân tích chi tiết vé bán ra theo thời gian và phim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <p>Biểu đồ thống kê vé sẽ hiển thị ở đây</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
