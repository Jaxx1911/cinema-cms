"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Plus, Phone, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomsTable } from "@/components/cinemas/rooms-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCinemaById } from "@/hooks/use-cinema";

export function CinemaDialog({
  isOpen,
  onClose,
  cinema,
  mode = "view",
  onSave,
}) {
  const isViewMode = mode === "view";
  const isAddMode = mode === "add";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    opening_hours: "",
    phone: "",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, is_active: value === "active" }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      opening_hours: "",
      phone: "",
      is_active: true,
    });
  };

  useEffect(() => {
    if (isAddMode) {
      resetForm();
    } else if (cinema && isViewMode) {
      setFormData({
        name: cinema.name || "",
        address: cinema.address || "",
        opening_hours: cinema.opening_hours || "",
        phone: cinema.phone || "",
        is_active: cinema.is_active,
      });
    }
  }, [cinema, isViewMode, isAddMode]);

  const handleClose = () => {
    if (isAddMode) {
      resetForm();
    }
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const dialogTitle = isAddMode ? "Thêm rạp mới" : "Chi tiết rạp";

  if (isAddMode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto scrollbar-none">
          <DialogHeader>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết về rạp mới
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên rạp</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên rạp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Nhập địa chỉ rạp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opening_hours">Giờ mở cửa</Label>
                <Input
                  id="opening_hours"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleChange}
                  required
                  placeholder="Nhập giờ mở cửa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.is_active ? "active" : "maintenance"}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit">Thêm rạp</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  } else if (isViewMode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-none">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8 pt-2">
              <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
                Thông tin rạp phim
              </DialogTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  // Switch to edit mode
                  onClose();
                  // Small delay to ensure dialog closes properly before reopening in edit mode
                  setTimeout(() => {
                    setDialogMode("edit");
                    setIsMovieDialogOpen(true);
                  }, 100);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa rạp phim
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Cinema Name
                    </dt>
                    <dd className="text-lg text-gray-900">{cinema?.name}</dd>
                  </div>
                  <div className="border rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">
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
                  <div className="col-span-2 border rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Địa chỉ
                    </dt>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <dd className="text-lg text-gray-900">
                        {cinema?.address}
                      </dd>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </dt>
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <dd className="text-lg text-gray-900">{cinema?.phone}</dd>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <dt className="text-sm font-medium text-gray-500">
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

          <DialogFooter className="mt-4">
            <Button type="button" onClick={onClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
