"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Plus,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoomsTable } from "@/components/cinemas/rooms-table";
import { useGetCinemas, useGetCinemaById, useUpdateCinema } from "@/hooks/use-cinema";
import { useGetSeatsByRoomId, useGetRoomById , useGetRooms } from "@/hooks/use-room";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CinemaDialog } from "@/components/cinemas/cinema-dialog";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

export default function CinemaDetailsPage() {
  const params = useParams();
  const { data: cinema, isLoading, error } = useGetCinemaById(params.id);
  const [isCinemaDialogOpen, setIsCinemaDialogOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view");
  const {
    mutate: updateCinema,
    data: updateData,
    isLoading: updateLoading,
    error: updateError,
  } = useUpdateCinema();
  const [cinemaData, setCinemaData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [cinemas, setCinemas] = useState();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    phone: "",
    opening_hours: "",
    is_active: true,
  });

  const handleSaveCinema = async (cinema) => {
    if (!cinema || !cinema.name || !cinema.address) {
      console.error("Dữ liệu rạp phim không hợp lệ:", cinema);
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc.",
        variant: "destructive",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    try {
      let response;

      if (dialogMode === "add") {
        response = await axios.post("http://localhost:8000/api/cinema", cinema);
        setCinemas([...cinemas, response.data]);

        toast({
          title: "Thành công",
          description: "Đã thêm rạp phim mới.",
          variant: "default",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });
      } else if (dialogMode === "edit") {
        await axios.put(
          `http://localhost:8000/api/cinema/${cinema.id}`,
          cinema
        );
        setCinemas(cinemas.map((c) => (c.id === cinema.id ? cinema : c)));
        toast({
          title: "Thành công",
          description: "Cập nhật rạp phim thành công.",
          variant: "default",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });
      }

      setIsDialogOpen(false); // Đóng form
      setFormData({
        // Reset form
        id: "",
        name: "",
        address: "",
        phone: "",
        opening_hours: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Lỗi khi lưu rạp:", error);
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message ||
          error.message ||
          "Có lỗi xảy ra khi lưu.",
        variant: "destructive",
        icon: <XCircle className="h-5 w-5 text-red-500" />,
      });
    }
  };

  const handleEditCinema = (cinema) => {
    setFormData({
      id: cinema.id, // rất quan trọng!
      name: cinema.name,
      address: cinema.address,
      phone: cinema.phone,
      opening_hours: cinema.opening_hours,
      is_active: cinema.is_active,
    });
    setSelectedCinema(cinema);
    setDialogMode("edit");
    setIsCinemaDialogOpen(true);
  };
  
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
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            onClick={() => handleEditCinema(cinema)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
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
                      Tên rạp phim
                    </dt>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <dd className="text-lg text-gray-900">
                        {cinema?.name}
                      </dd>
                    </div>
                  </div>
                  <div className=" rounded-lg p-1">
                    <dt className="text-sm font-medium text-gray-500 mb-2">
                      Trạng thái
                    </dt>
                    <dd>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          cinema?.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {cinema?.is_active ? "Hoạt động" : "Dừng hoạt động"}
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
            <RoomsTable rooms={cinema?.rooms || []} cinemaId={cinema?.id} />
          </div>
        </Card>
      </div>
      <CinemaDialog
        isOpen={isCinemaDialogOpen}
        onClose={() => setIsCinemaDialogOpen(false)}
        cinema={selectedCinema}
        mode={dialogMode}
        onSave={handleSaveCinema}
        setDialogMode={setDialogMode}
        setIsCinemaDialogOpen={setIsCinemaDialogOpen}
      />
    </div>
  );
}
