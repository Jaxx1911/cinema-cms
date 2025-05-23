"use client";

import { useState, useEffect } from "react";
import { Edit, Chair } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RoomDialog({
  isOpen,
  onClose,
  room,
  mode = "view",
  onSave,
  setDialogMode,
  setIsRoomDialogOpen,
}) {
  const isViewMode = mode === "view";
  const isAddMode = mode === "add";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    type: "2d",
    row_count: "",
    column_count: "",
    is_active: true,
    vip_row_start: "",
    vip_row_end: "",
    vip_col_start: "",
    vip_col_end: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      is_active: value === "true",
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      capacity: "",
      type: "2d",
      row_count: "",
      column_count: "",
      is_active: true,
      vip_row_start: "",
      vip_row_end: "",
      vip_col_start: "",
      vip_col_end: "",
    });
  };

  useEffect(() => {
    if (isEditMode && room) {
      setFormData({
        name: room.name || "",
        capacity: room.capacity || "",
        type: room.type || "2D",
        row_count: room.row_count || "",
        column_count: room.column_count || "",
        is_active: room.is_active,
        vip_row_start: room.vip_row_start || "",
        vip_row_end: room.vip_row_end || "",
        vip_col_start: room.vip_col_start || "",
        vip_col_end: room.vip_col_end || "",
      });
    }
    if (isAddMode) {
      resetForm();
    }
  }, [room, isEditMode, isAddMode]);

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
    window.location.reload();
  };

  const dialogTitle = isAddMode
    ? "Thêm phòng chiếu mới"
    : isEditMode
    ? "Chỉnh sửa phòng chiếu"
    : "Chi tiết phòng chiếu";

  function renderSeatMatrix(row, column) {
    const rowCount = Number(row);
    const colCount = Number(column);
    if (!rowCount || !colCount) return null;

    // Helper để so sánh ký tự hàng
    const isRowInVip = (rowChar) => {
      if (!formData.vip_row_start || !formData.vip_row_end) return false;
      return (
        rowChar >= formData.vip_row_start.toUpperCase() &&
        rowChar <= formData.vip_row_end.toUpperCase()
      );
    };
    // Helper để so sánh cột
    const isColInVip = (colNum) => {
      if (!formData.vip_col_start || !formData.vip_col_end) return false;
      return (
        colNum >= Number(formData.vip_col_start) &&
        colNum <= Number(formData.vip_col_end)
      );
    };

    return (
      <div>
        {/* Screen */}
        <div
          className="font-bold bg-gray-400 rounded-lg text-white mb-8 flex items-center justify-center"
          style={{
            width: `${colCount * 60 + (colCount - 1) * 6}px`,
          }}
        >
          Screen
        </div>
        {/* Ma trận ghế */}
        {Array.from({ length: rowCount }).map((_, rowIdx) => {
          const rowChar = String.fromCharCode(65 + rowIdx);
          return (
            <div key={rowIdx} style={{ display: "flex", marginBottom: 6 }}>
              {rowIdx === rowCount - 1
                ? // Hàng cuối: ghế đôi
                  (() => {
                    const doubleSeats = [];
                    for (let colIdx = 0; colIdx < colCount; colIdx += 2) {
                      // Ghế đôi: nếu cả 2 ghế đều là VIP thì ghế đôi là VIP
                      const isVip =
                        isRowInVip(rowChar) &&
                        isColInVip(colIdx + 1) &&
                        isColInVip(colIdx + 2);

                      doubleSeats.push(
                        <div
                          key={colIdx}
                          style={{
                            width: 126,
                            height: 40,
                            marginRight: 6,
                            background: isVip ? "#7c3aed" : "#77103C", // tím cho VIP, đỏ cho thường
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 14,
                            fontWeight: "500",
                            color: "#fff",
                            border: "1px solid #d1d5db",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                          }}
                        >
                          {`${rowChar}${colIdx + 1}-${
                            colIdx + 2 <= colCount ? colIdx + 2 : ""
                          }`}
                        </div>
                      );
                    }
                    return doubleSeats;
                  })()
                : // Các hàng khác: ghế đơn
                  Array.from({ length: colCount }).map((_, colIdx) => {
                    const isVip = isRowInVip(rowChar) && isColInVip(colIdx + 1);

                    return (
                      <div
                        key={colIdx}
                        style={{
                          width: 60,
                          height: 40,
                          marginRight: 6,
                          background: isVip ? "#7c3aed" : "#e5e7eb", // tím cho VIP, xám cho thường
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: "500",
                          color: isVip ? "#fff" : "#111827",
                          border: "1px solid #d1d5db",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      >
                        {rowChar}
                        {colIdx + 1}
                      </div>
                    );
                  })}
            </div>
          );
        })}
      </div>
    );
  }

  if (isAddMode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto scrollbar-none ">
          <DialogHeader>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
            {!isViewMode && (
              <DialogDescription>
                {isAddMode
                  ? "Nhập thông tin chi tiết về phòng chiếu mới"
                  : "Chỉnh sửa thông tin phòng chiếu"}
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8 ">
              {/* Bên trái: Ma trận ghế */}
              <div className="w-full md:w-3/4 flex justify-center bg-gray-100 rounded-xl p-8">
                <div className="flex flex-col items-center">
                  {renderSeatMatrix(formData.row_count, formData.column_count)}
                </div>
              </div>
              {/* Bên phải: Form nhập liệu */}
              <div className="w-full md:w-1/4 space-y-4 bg-white p-6 shadow-lg border rounded-2xl">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold text-gray-700">
                    Tên phòng
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập tên phòng"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">
                    Sức chứa
                  </Label>
                  <Input
                    value={
                      formData.row_count && formData.column_count
                        ? Number(formData.row_count) *
                          Number(formData.column_count)
                        : ""
                    }
                    readOnly
                    disabled
                    className="h-12 text-base"
                    placeholder="Sức chứa sẽ tự động tính"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="font-semibold text-gray-700">
                    Loại phòng
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-sm" value="2d">
                        2D
                      </SelectItem>
                      <SelectItem className="text-sm" value="3d">
                        3D
                      </SelectItem>
                      <SelectItem className="text-sm" value="4dx">
                        4DX
                      </SelectItem>
                      <SelectItem className="text-sm" value="imax">
                        IMAX
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="row_count"
                      className="font-semibold text-gray-700"
                    >
                      Số hàng
                    </Label>
                    <Input
                      id="row_count"
                      name="row_count"
                      type="number"
                      value={formData.row_count || ""}
                      onChange={handleChange}
                      placeholder="Nhập số hàng"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="column_count"
                      className="font-semibold text-gray-700"
                    >
                      Số cột
                    </Label>
                    <Input
                      id="column_count"
                      name="column_count"
                      type="number"
                      value={formData.column_count}
                      onChange={handleChange}
                      placeholder="Nhập số cột"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_row_start"
                      className="font-semibold text-gray-700"
                    >
                      Hàng bắt đầu ghế VIP
                    </Label>
                    <Input
                      id="vip_row_start"
                      name="vip_row_start"
                      type="text"
                      value={formData.vip_row_start}
                      onChange={handleChange}
                      placeholder="Ví dụ: C"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_row_end"
                      className="font-semibold text-gray-700"
                    >
                      Hàng kết thúc ghế VIP
                    </Label>
                    <Input
                      id="vip_row_end"
                      name="vip_row_end"
                      type="text"
                      value={formData.vip_row_end}
                      onChange={handleChange}
                      placeholder="Ví dụ: E"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_col_start"
                      className="font-semibold text-gray-700"
                    >
                      Cột bắt đầu ghế VIP
                    </Label>
                    <Input
                      id="vip_col_start"
                      name="vip_col_start"
                      type="number"
                      value={formData.vip_col_start}
                      onChange={handleChange}
                      placeholder="Ví dụ: 3"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_col_end"
                      className="font-semibold text-gray-700"
                    >
                      Cột kết thúc ghế VIP
                    </Label>
                    <Input
                      id="vip_col_end"
                      name="vip_col_end"
                      type="number"
                      value={formData.vip_col_end}
                      onChange={handleChange}
                      placeholder="Ví dụ: 8"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="font-semibold text-gray-700"
                  >
                    Trạng thái
                  </Label>
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
            </div>
          </form>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              {isViewMode ? "Đóng" : "Hủy"}
            </Button>

            {!isViewMode && (
              <Button type="submit">
                {isAddMode ? "Thêm phòng" : "Lưu thay đổi"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else if (isEditMode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto scrollbar-none ">
          <DialogHeader>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
            {!isViewMode && (
              <DialogDescription>
                {isAddMode
                  ? "Nhập thông tin chi tiết về phòng chiếu mới"
                  : "Chỉnh sửa thông tin phòng chiếu"}
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8 ">
              {/* Bên trái: Ma trận ghế */}
              <div className="w-full md:w-3/4 flex justify-center bg-gray-100 rounded-xl p-8">
                <div className="flex flex-col items-center">
                  {renderSeatMatrix(formData.row_count, formData.column_count)}
                </div>
              </div>
              {/* Bên phải: Form nhập liệu */}
              <div className="w-full md:w-1/4 space-y-4 bg-white p-6 shadow-lg border rounded-2xl">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold text-gray-700">
                    Tên phòng
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nhập tên phòng"
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">
                    Sức chứa
                  </Label>
                  <Input
                    value={
                      formData.row_count && formData.column_count
                        ? Number(formData.row_count) *
                          Number(formData.column_count)
                        : ""
                    }
                    readOnly
                    disabled
                    className="h-12 text-base"
                    placeholder="Sức chứa sẽ tự động tính"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="font-semibold text-gray-700">
                    Loại phòng
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className="text-sm" value="2d">
                        2D
                      </SelectItem>
                      <SelectItem className="text-sm" value="3d">
                        3D
                      </SelectItem>
                      <SelectItem className="text-sm" value="4dx">
                        4DX
                      </SelectItem>
                      <SelectItem className="text-sm" value="imax">
                        IMAX
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="row_count"
                      className="font-semibold text-gray-700"
                    >
                      Số hàng
                    </Label>
                    <Input
                      id="row_count"
                      name="row_count"
                      type="number"
                      value={formData.row_count || ""}
                      onChange={handleChange}
                      required
                      placeholder="Nhập số hàng"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="column_count"
                      className="font-semibold text-gray-700"
                    >
                      Số cột
                    </Label>
                    <Input
                      id="column_count"
                      name="column_count"
                      type="number"
                      value={formData.column_count || ""}
                      onChange={handleChange}
                      required
                      placeholder="Nhập số cột"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_row_start"
                      className="font-semibold text-gray-700"
                    >
                      Hàng bắt đầu ghế VIP
                    </Label>
                    <Input
                      id="vip_row_start"
                      name="vip_row_start"
                      type="text"
                      value={formData.vip_row_start}
                      onChange={handleChange}
                      placeholder="Ví dụ: C"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_row_end"
                      className="font-semibold text-gray-700"
                    >
                      Hàng kết thúc ghế VIP
                    </Label>
                    <Input
                      id="vip_row_end"
                      name="vip_row_end"
                      type="text"
                      value={formData.vip_row_end}
                      onChange={handleChange}
                      placeholder="Ví dụ: E"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_col_start"
                      className="font-semibold text-gray-700"
                    >
                      Cột bắt đầu ghế VIP
                    </Label>
                    <Input
                      id="vip_col_start"
                      name="vip_col_start"
                      type="number"
                      value={formData.vip_col_start}
                      onChange={handleChange}
                      placeholder="Ví dụ: 3"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_col_end"
                      className="font-semibold text-gray-700"
                    >
                      Cột kết thúc ghế VIP
                    </Label>
                    <Input
                      id="vip_col_end"
                      name="vip_col_end"
                      type="number"
                      value={formData.vip_col_end}
                      onChange={handleChange}
                      placeholder="Ví dụ: 8"
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="font-semibold text-gray-700"
                  >
                    Trạng thái
                  </Label>
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
            </div>
          </form>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              {isViewMode ? "Đóng" : "Hủy"}
            </Button>

            {!isViewMode && (
              <Button type="submit">
                {isAddMode ? "Thêm phòng" : "Lưu thay đổi"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto scrollbar-none ">
          <DialogHeader>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
            {!isViewMode && (
              <DialogDescription>
                {isAddMode
                  ? "Nhập thông tin chi tiết về phòng chiếu mới"
                  : "Chỉnh sửa thông tin phòng chiếu"}
              </DialogDescription>
            )}
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8 ">
              {/* Bên trái: Ma trận ghế */}
              <div className="w-full md:w-3/4 flex justify-center bg-gray-100 rounded-xl p-8">
                <div className="flex flex-col items-center">
                  {renderSeatMatrix(room?.row_count, room?.column_count)}
                </div>
              </div>
              {/* Bên phải: Form nhập liệu */}
              <div className="w-full md:w-1/4 space-y-4 bg-white p-6 shadow-lg border rounded-2xl">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold text-gray-700">
                    Tên phòng
                  </Label>
                  <Input value={room?.name || ""} readOnly disabled />
                </div>

                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">
                    Sức chứa
                  </Label>
                  <Input
                    value={room?.capacity || ""}
                    readOnly
                    disabled
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">
                    Loại phòng
                  </Label>
                  <Input
                    value={room?.type || ""}
                    readOnly
                    disabled
                    className="h-12 text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">
                      Số hàng
                    </Label>
                    <Input
                      value={room?.row_count || ""}
                      readOnly
                      disabled
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">
                      Số cột
                    </Label>
                    <Input
                      value={room?.column_count || ""}
                      readOnly
                      disabled
                      className="h-12 text-base"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="font-semibold text-gray-700"
                  >
                    Trạng thái
                  </Label>
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
            </div>
          </form>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              {isViewMode ? "Đóng" : "Hủy"}
            </Button>

            {!isViewMode && (
              <Button type="submit">
                {isAddMode ? "Thêm phòng" : "Lưu thay đổi"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
