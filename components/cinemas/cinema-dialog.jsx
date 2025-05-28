"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Edit, Plus, Phone, Clock, MapPin, Building2 } from "lucide-react";
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
import { RoomsTable } from "@/components/rooms/rooms-list";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
    opening_hour: "",
    closing_hour: "",
    phone: "",
    is_active: true,
  });

  const updateOpeningHours = (opening, closing) => {
    if (opening && closing) {
      setFormData((prev) => ({
        ...prev,
        opening_hours: `${opening} - ${closing}`,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      is_active: value === "true" || value === true ? true : false,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      address: "",
      opening_hours: "",
      opening_hour: "",
      closing_hour: "",
      phone: "",
      is_active: true,
    });
  };

  useEffect(() => {
    if (cinema && isEditMode) {
      const opening = cinema.opening_hour || "";
      const closing = cinema.closing_hour || "";
      setFormData({
        id: cinema.id || "",
        name: cinema.name || "",
        address: cinema.address || "",
        opening_hours: cinema.opening_hours || "",
        opening_hour: opening,
        closing_hour: closing,
        phone: cinema.phone || "",
        is_active: cinema.is_active === "true" ? true : false,
      });
    } else if (isAddMode) {
      resetForm();
    }
  }, [cinema, isEditMode, isAddMode]);

  useEffect(() => {
    updateOpeningHours(formData.opening_hour, formData.closing_hour);
  }, [formData.opening_hour, formData.closing_hour]);

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
    window.location.reload();
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
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2 col-span-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="name">Tên rạp</Label>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên rạp"
                  />
                </div>
                <div className="space-y-4 col-span-1">
                  <Label htmlFor="status">Trạng thái</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={formData.is_active}
                      onCheckedChange={handleStatusChange}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.is_active ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      {formData.is_active ? "Hoạt động" : "Dừng hoạt động"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="address">Địa chỉ</Label>
                </div>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Nhập địa chỉ rạp"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Label>Giờ mở cửa</Label>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={formData.opening_hour?.split(":")[0] || ""}
                      onValueChange={(hour) => {
                        const minutes =
                          formData.opening_hour?.split(":")[1] || "00";
                        const timeString = `${hour}:${minutes}`;
                        setFormData((prev) => ({
                          ...prev,
                          opening_hour: timeString,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.opening_hour?.split(":")[1] || ""}
                      onValueChange={(minute) => {
                        const hours =
                          formData.opening_hour?.split(":")[0] || "00";
                        const timeString = `${hours}:${minute}`;
                        setFormData((prev) => ({
                          ...prev,
                          opening_hour: timeString,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Phút" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(60).keys()].map((minute) => {
                          const value = minute.toString().padStart(2, "0");
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Label>Giờ đóng cửa</Label>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={formData.closing_hour?.split(":")[0] || ""}
                      onValueChange={(hour) => {
                        const minutes =
                          formData.closing_hour?.split(":")[1] || "00";
                        const timeString = `${hour}:${minutes}`;
                        setFormData((prev) => ({
                          ...prev,
                          closing_hour: timeString,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.closing_hour?.split(":")[1] || ""}
                      onValueChange={(minute) => {
                        const hours =
                          formData.closing_hour?.split(":")[0] || "00";
                        const timeString = `${hours}:${minute}`;
                        setFormData((prev) => ({
                          ...prev,
                          closing_hour: timeString,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Phút" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(60).keys()].map((minute) => {
                          const value = minute.toString().padStart(2, "0");
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="phone">Số điện thoại</Label>
                  </div>
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

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Thêm rạp
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  } else if (isEditMode) {
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
              <div className="grid grid-cols-5 gap-4">
                <div className="space-y-2 col-span-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="name">Tên rạp</Label>
                  </div>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên rạp"
                  />
                </div>
                <div className="space-y-4 col-span-1">
                  <Label htmlFor="status">Trạng thái</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="status"
                      checked={formData.is_active}
                      onCheckedChange={handleStatusChange}
                      className="data-[state=checked]:bg-green-500"
                    />
                    <span
                      className={`text-sm font-medium ${
                        formData.is_active ? "text-green-500" : "text-gray-500"
                      }`}
                    >
                      {formData.is_active ? "Hoạt động" : "Dừng hoạt động"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Label htmlFor="address">Địa chỉ</Label>
                </div>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Nhập địa chỉ rạp"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Label>Giờ mở cửa</Label>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={formData.opening_hour?.split(":")[0] || ""}
                      onValueChange={(hour) => {
                        const minutes =
                          formData.opening_hour?.split(":")[1] || "00";
                        const timeString = `${hour}:${minutes}`;
                        setFormData((prev) => ({
                          ...prev,
                          opening_hour: timeString,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.opening_hour?.split(":")[1] || ""}
                      onValueChange={(minute) => {
                        const hours =
                          formData.opening_hour?.split(":")[0] || "00";
                        const timeString = `${hours}:${minute}`;
                        setFormData((prev) => ({
                          ...prev,
                          opening_hour: timeString,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Phút" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(60).keys()].map((minute) => {
                          const value = minute.toString().padStart(2, "0");
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Label>Giờ đóng cửa</Label>
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={formData.closing_hour?.split(":")[0] || ""}
                      onValueChange={(hour) => {
                        const minutes =
                          formData.closing_hour?.split(":")[1] || "00";
                        const timeString = `${hour}:${minutes}`;
                        setFormData((prev) => ({
                          ...prev,
                          closing_hour: timeString,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Giờ" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i.toString().padStart(2, "0");
                          return (
                            <SelectItem key={hour} value={hour}>
                              {hour}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.closing_hour?.split(":")[1] || ""}
                      onValueChange={(minute) => {
                        const hours =
                          formData.closing_hour?.split(":")[0] || "00";
                        const timeString = `${hours}:${minute}`;
                        setFormData((prev) => ({
                          ...prev,
                          closing_hour: timeString,
                        }));
                      }}
                    >
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Phút" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(60).keys()].map((minute) => {
                          const value = minute.toString().padStart(2, "0");
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="phone">Số điện thoại</Label>
                  </div>
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

            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}
