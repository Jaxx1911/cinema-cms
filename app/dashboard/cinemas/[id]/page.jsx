"use client"
import Link from "next/link"
import { ArrowLeft, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockCinemas, mockScreens } from "@/lib/mock-data"
import { ScreensTable } from "@/components/cinemas/screens-table"

export default function CinemaDetailsPage({ params }) {
  const cinemaId = Number.parseInt(params.id)
  const cinema = mockCinemas.find((c) => c.id === cinemaId)
  const screens = mockScreens.filter((s) => s.cinemaId === cinemaId)

  if (!cinema) {
    return <div>Không tìm thấy rạp phim</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/cinemas">
            <Button variant="outline" size="icon" className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{cinema.name}</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/cinemas/${cinema.id}/edit`}>
            <Button variant="outline" className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900">Thông tin rạp phim</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="text-lg text-gray-900">{cinema.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Trạng thái</dt>
                <dd>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      cinema.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {cinema.status === "active" ? "Hoạt động" : "Bảo trì"}
                  </div>
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                <dd className="text-lg text-gray-900">{cinema.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Số phòng</dt>
                <dd className="text-lg text-gray-900">{cinema.screenCount}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
                <dd className="text-lg text-gray-900">{cinema.phone}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-lg text-gray-900">{cinema.email}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900">Thống kê</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Tổng doanh thu</dt>
                <dd className="text-2xl font-bold text-gray-900">2.5 tỷ VND</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Vé đã bán</dt>
                <dd className="text-2xl font-bold text-gray-900">12,345</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Suất chiếu hôm nay</dt>
                <dd className="text-2xl font-bold text-gray-900">24</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phim đang chiếu</dt>
                <dd className="text-2xl font-bold text-gray-900">8</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="screens" className="space-y-4">
        <TabsList className="bg-white">
          <TabsTrigger value="screens" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Phòng chiếu
          </TabsTrigger>
          <TabsTrigger value="showtimes" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Lịch chiếu
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Doanh thu
          </TabsTrigger>
        </TabsList>
        <TabsContent value="screens" className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Danh sách phòng chiếu</h3>
              <Link href={`/dashboard/cinemas/${cinema.id}/screens/new`}>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm phòng chiếu
                </Button>
              </Link>
            </div>
            <ScreensTable screens={screens} cinemaId={cinema.id} />
          </div>
        </TabsContent>
        <TabsContent value="showtimes">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Lịch chiếu</CardTitle>
              <CardDescription>Danh sách các suất chiếu tại rạp</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Nội dung lịch chiếu sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="revenue">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Doanh thu</CardTitle>
              <CardDescription>Thống kê doanh thu của rạp</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Biểu đồ doanh thu sẽ hiển thị ở đây</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
