"use client";

import { useState } from "react";
import { Edit, Trash2, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCinemas } from "@/hooks/use-cinema";
import { useRouter } from "next/navigation";

export default function CinemaList({handleViewCinema, handleEditCinema, handleDeleteClick}) {
  const { data: cinemas, isLoading, error } = useGetCinemas();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Tìm kiếm rạp phim..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-1/8">Tên rạp</TableHead>
              <TableHead className="w-1/3">Địa chỉ</TableHead>
              <TableHead className="w-1/8">Giờ mở cửa</TableHead>
              <TableHead className="w-1/8">Số điện thoại</TableHead>
              <TableHead className="w-flex">Trạng thái</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cinemas.filter((cinema) => cinema.name.toLowerCase().includes(searchTerm.toLowerCase())).map((cinema) => (
              <TableRow key={cinema.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-blue-600">{cinema.name}</TableCell>
                <TableCell>{cinema.address}</TableCell>
                <TableCell>{cinema.opening_hours}</TableCell>
                <TableCell>{cinema.phone}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    cinema.is_active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {cinema.is_active ? "Hoạt động" : "Bảo trì"}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-blue-600"
                      onClick={() => router.push(`/dashboard/cinemas/${cinema.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Xem chi tiết</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(cinema.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Xóa</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
