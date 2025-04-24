"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NewCinemaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    status: "active",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would save the cinema here
    console.log("Submitting cinema:", formData)
    router.push("/dashboard/cinemas")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/cinemas">
          <Button variant="outline" size="icon" className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Thêm rạp phim mới</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Thông tin rạp phim</CardTitle>
            <CardDescription>Nhập thông tin chi tiết về rạp phim mới</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Tên rạp phim
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nhập tên rạp phim"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-700">
                  Trạng thái
                </Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-gray-700">
                  Địa chỉ
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Nhập địa chỉ rạp phim"
                  value={formData.address}
                  onChange={handleChange}
                  className="border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-gray-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-gray-200"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Link href="/dashboard/cinemas">
              <Button variant="outline" className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50">
                Hủy
              </Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Lưu
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
