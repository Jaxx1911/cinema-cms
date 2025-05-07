"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit, Plus, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomsTable } from "@/components/cinemas/rooms-table";
import { useGetCinemas } from "@/hooks/use-cinema";
import { useGetCinemaById } from "@/hooks/use-cinema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";

export default function CinemaDetailsPage(){
  const params = useParams();
  const { data: cinema , isLoading, error } = useGetCinemaById(params.id);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!cinema) {
    return <div>Không tìm thấy rạp phim</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/cinemas">
            <Button
              variant="outline"
              size="icon"
              className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {cinema.name}
          </h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/cinemas/${cinema.id}/edit`}>
            <Button
              variant="outline"
              className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            >
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-900">Thông tin rạp phim</CardTitle>
          </CardHeader>
          <div className="space-y-0">
            <Card className="border-0 shadow-sm">
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div className=" rounded-lg p-1">
                    <dt className="text-sm font-medium text-gray-500 mb-2">
                      Cinema Name
                    </dt>
                    <dd className="text-lg text-gray-900">{cinema?.name}</dd>
                  </div>
                  <div className=" rounded-lg p-1">
                    <dt className="text-sm font-medium text-gray-500 mb-2">
                      Trạng thái
                    </dt>
                    <dd>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          cinema?.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {cinema?.is_active ? "Hoạt động" : "Bảo trì"}
                      </div>
                    </dd>
                  </div>
                  <div className="col-span-2  rounded-lg p-1">
                    <dt className="text-sm font-medium text-gray-500 mb-2">
                      Địa chỉ
                    </dt>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <dd className="text-lg text-gray-900">
                        {cinema?.address}
                      </dd>
                    </div>
                  </div>

                  <div className=" rounded-lg p-1">
                    <dt className="text-sm font-medium text-gray-500 mb-2">
                      Số điện thoại
                    </dt>
                    <div className="flex items-center gap-1">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <dd className="text-lg text-gray-900">{cinema?.phone}</dd>
                    </div>
                  </div>
                  <div className=" rounded-lg p-1">
                    <dt className="text-sm font-medium text-gray-500 mb-2">
                      Giờ hoạt động
                    </dt>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <dd className="text-lg text-gray-900">
                        {cinema?.opening_hours}
                      </dd>
                    </div>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Tabs defaultValue="rooms" className="space-y-4">
              <TabsContent value="rooms" className="space-y-4">
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Danh sách phòng chiếu
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      onClick={() => onSave({ ...cinema, mode: "edit" })}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  </div>
                  <RoomsTable
                    rooms={cinema?.rooms || []}
                    cinemaId={cinema?.id}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>

      </div>


    </div>
  );
}
