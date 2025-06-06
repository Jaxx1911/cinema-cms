"use client";
import { use, useState } from "react";
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
import { RoomsList } from "@/components/rooms/rooms-list";
import { useGetCinemaById, useUpdateCinema, useCreateCinema } from "@/hooks/use-cinema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams,useRouter } from "next/navigation";
import { CinemaDialog } from "@/components/cinemas/cinema-dialog";
import { useToast } from "@/hooks/use-toast";

export default function CinemaDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const { data: cinema, isLoading, error, refetch } = useGetCinemaById(params.id);
  const [isCinemaDialogOpen, setIsCinemaDialogOpen] = useState(false);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view");
  
  // Use hooks for cinema operations
  const { mutate: updateCinema, isLoading: updateLoading, error: updateError } = useUpdateCinema();
  const { mutate: createCinema, isLoading: createLoading, error: createError } = useCreateCinema();
  
  const [cinemaData, setCinemaData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
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
    console.log("handleSaveCinema called with:", cinema);
    console.log("dialogMode:", dialogMode);
    
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

    if (dialogMode === "add") {
      console.log("Creating cinema with data:", cinema);
      createCinema(cinema, {
        onSuccess: (data) => {
          console.log("Create success, received data:", data);
          toast({
            title: "Thành công",
            description: "Đã thêm rạp phim mới.",
            variant: "default",
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          });
          setIsCinemaDialogOpen(false);
          resetForm();
        },
        onError: (error) => {
          console.error("Create error:", error);
          toast({
            title: "Lỗi",
            description: error?.message || "Có lỗi xảy ra khi tạo rạp phim.",
            variant: "destructive",
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          });
        }
      });
    } else if (dialogMode === "edit") {
      console.log("Updating cinema with data:", { id: cinema.id, cinema });
      updateCinema({ id: cinema.id, cinema }, {
        onSuccess: (data) => {
          console.log("Update success, received data:", data);
          toast({
            title: "Thành công",
            description: "Cập nhật rạp phim thành công.",
            variant: "default",
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          });
          setIsCinemaDialogOpen(false);
          resetForm();
          // Refetch the current cinema data to see the updates
          refetch();
        },
        onError: (error) => {
          console.error("Update error:", error);
          toast({
            title: "Lỗi",
            description: error?.message || "Có lỗi xảy ra khi cập nhật rạp phim.",
            variant: "destructive",
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          });
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      address: "",
      phone: "",
      opening_hours: "",
      is_active: true,
    });
  };

  const handleEditCinema = (cinema) => {
    setFormData({
      id: cinema.id,
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
            <RoomsList rooms={cinema?.rooms || []} cinemaId={cinema?.id} />
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
