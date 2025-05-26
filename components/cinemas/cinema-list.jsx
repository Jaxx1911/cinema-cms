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
import { useGetCinemas} from "@/hooks/use-cinema";
import { useRouter } from "next/navigation";
import { useCreateRoom } from "@/hooks/use-room";

export default function CinemaList({ handleViewCinema, handleDeleteClick }) {
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
              <TableHead className="w-1/2">Địa chỉ</TableHead>
              <TableHead className="w-1/8">Giờ mở cửa</TableHead>
              <TableHead className="w-1/8">Số điện thoại</TableHead>
              <TableHead className="w-1/8 text-center">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cinemas
              .filter((cinema) =>
                cinema.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((cinema) => (
                <TableRow key={cinema.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className=" text-gray-500 w-full justify-start hover:text-blue-600 hover:bg-gray-50"
                    onClick={() =>
                      router.push(`/dashboard/cinemas/${cinema.id}`)
                    }
                  >
                    {cinema.name}
                  </Button>
                  </TableCell>
                  <TableCell>{cinema.address}</TableCell>
                  <TableCell>{cinema.opening_hours}</TableCell>
                  <TableCell>{cinema.phone}</TableCell>
                  <TableCell className="text-center">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        cinema.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {cinema.is_active ? "Hoạt động" : "Dừng hoạt động"}
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
