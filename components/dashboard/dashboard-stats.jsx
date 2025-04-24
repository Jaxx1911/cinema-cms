import { Building2, Film, Calendar, Users, Ticket, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">5.2 tỷ VND</h3>
              <p className="mt-1 text-xs font-medium text-green-600">+20.1% so với tháng trước</p>
            </div>
            <div className="rounded-full bg-blue-50 p-3">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Vé đã bán</p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">24,532</h3>
              <p className="mt-1 text-xs font-medium text-green-600">+15% so với tháng trước</p>
            </div>
            <div className="rounded-full bg-green-50 p-3">
              <Ticket className="h-6 w-6 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Rạp phim</p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">5</h3>
              <p className="mt-1 text-xs font-medium text-green-600">+1 rạp mới trong tháng này</p>
            </div>
            <div className="rounded-full bg-purple-50 p-3">
              <Building2 className="h-6 w-6 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Phim đang chiếu</p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">12</h3>
              <p className="mt-1 text-xs font-medium text-green-600">+3 phim mới trong tuần này</p>
            </div>
            <div className="rounded-full bg-red-50 p-3">
              <Film className="h-6 w-6 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Suất chiếu hôm nay</p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">48</h3>
              <p className="mt-1 text-xs font-medium text-green-600">+8 suất so với hôm qua</p>
            </div>
            <div className="rounded-full bg-orange-50 p-3">
              <Calendar className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Người dùng</p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">10,482</h3>
              <p className="mt-1 text-xs font-medium text-green-600">+5.2% so với tháng trước</p>
            </div>
            <div className="rounded-full bg-cyan-50 p-3">
              <Users className="h-6 w-6 text-cyan-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
