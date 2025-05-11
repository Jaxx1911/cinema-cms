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
    id: "",
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
    setFormData((prev) => ({
      ...prev,
      is_active: value === 'true' || value === true ? true : false,
    }));
  };
  

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      address: "",
      opening_hours: "",
      closing_hours: "",
      phone: "",
      is_active: true,
    });
  };

  useEffect(() => {
    if (cinema && isEditMode) {
      setFormData({
        id: cinema.id || "",
        name: cinema.name || "",
        address: cinema.address || "",
        opening_hours: cinema.opening_hours || "",
        closing_hours: cinema.closing_hours || "",
        phone: cinema.phone || "",
        is_active: cinema.is_active === "true" ? true : false,
      });
    } else if (isAddMode) {
      resetForm();
    }
  }, [cinema, isEditMode, isAddMode]);
  

  const handleClose = () => {
    if (isAddMode) {
      resetForm();
    }
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAddMode && (!formData.name || !formData.address)) {
      alert("Vui lòng nhập đầy đủ tên và địa chỉ rạp!");
      return;
    }
    onSave(formData);
    onClose();
  };

  const dialogTitle = isAddMode
    ? "Thêm rạp mới"
    : isEditMode
    ? "Chỉnh sửa rạp"
    : "Chi tiết rạp";

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
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2 col-span-3">
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
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={formData.is_active ? "true" : "false"}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Hoạt động</SelectItem>
                      <SelectItem value="false">Dừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Giờ hoạt động</Label>
                    <Input
                      id="opening_hours"
                      name="opening_hours"
                      value={formData.opening_hours}
                      onChange={handleChange}
                      required
                      placeholder="Nhập giờ hoạt động"
                    />
                  </div>
                </div>
                <div className="grid gap-4">
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
                </div>
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
  } else if (isEditMode) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto scrollbar-none">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Chỉnh sửa rạp phim
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSave(formData);
                    onClose();
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">
                      Cinema Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">
                      Trạng thái
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.is_active ? true : false}
                      onChange={e => {
                        setFormData({ ...formData, is_active: e.target.value === 'true' ? true : false });
                        console.log("onChange is_active:", e.target.value, formData);
                      }}
                    >
                      <option value="true">Hoạt động</option>
                      <option value="false">Dừng hoạt động</option>
                    </select>
                  </div>

                  <div className="col-span-2 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>

                  <div className="rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-500">
                      Giờ hoạt động
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.opening_hours}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          opening_hours: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="col-span-2 flex justify-end gap-x-2 mt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Hủy
                    </Button>
                    <Button type="submit">Lưu thay đổi</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
