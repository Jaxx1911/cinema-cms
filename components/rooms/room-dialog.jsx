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
import { useGetSeatsByRoomId } from "@/hooks/use-seat";

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

  const handleClose = () => {
    if (isAddMode) {
      resetForm();
    }
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit form", formData);
    onSave(formData);
  };

  const dialogTitle = isAddMode
    ? "Thêm phòng chiếu mới"
    : isEditMode
    ? "Chỉnh sửa phòng chiếu"
    : "Chi tiết phòng chiếu";

  function renderSeatMatrix(rowCount, colCount, vipArea) {
    rowCount = Number(rowCount);
    colCount = Number(colCount);
    if (!rowCount || !colCount) return null;

    // Helper kiểm tra ghế có phải VIP không
    const isVip = (rowChar, colNum) => {
      if (
        !vipArea.vip_row_start ||
        !vipArea.vip_row_end ||
        !vipArea.vip_col_start ||
        !vipArea.vip_col_end
      )
        return false;
      return (
        rowChar >= vipArea.vip_row_start &&
        rowChar <= vipArea.vip_row_end &&
        colNum >= vipArea.vip_col_start &&
        colNum <= vipArea.vip_col_end
      );
    };

    const lastRowChar = String.fromCharCode(65 + rowCount - 1);

    return (
      <div>
        {/* Screen */}
        <div
          className="font-bold bg-gray-400 rounded-lg text-white mb-8 flex items-center justify-center"
          style={{
            width: `${colCount * 40 + (colCount - 1) * 6}px`,
          }}
        >
          Screen
        </div>
        {/* Ma trận ghế */}
        {Array.from({ length: rowCount }).map((_, rowIdx) => {
          const rowChar = String.fromCharCode(65 + rowIdx);

          // Hàng cuối: ghế đôi
          if (rowChar === lastRowChar) {
            const doubleSeats = [];
            for (let colIdx = 0; colIdx < colCount; colIdx += 2) {
              const colNum1 = colIdx + 1;
              const colNum2 = colIdx + 2;
              // Ghế đôi là VIP nếu cả 2 ghế đều là VIP
              const isDoubleVip =
                isVip(rowChar, colNum1) && isVip(rowChar, colNum2);
              doubleSeats.push(
                <div
                  key={colIdx}
                  style={{
                    width: 86,
                    height: 40,
                    marginRight: 6,
                    background: isDoubleVip ? "#e11d48" : "#77103C", // hồng cho VIP, đỏ cho thường
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
                  {`${rowChar}${colNum1}-${colNum2 <= colCount ? colNum2 : ""}`}
                </div>
              );
            }
            return (
              <div key={rowIdx} style={{ display: "flex", marginBottom: 6 }}>
                {doubleSeats}
              </div>
            );
          }

          // Các hàng khác: ghế đơn
          return (
            <div key={rowIdx} style={{ display: "flex", marginBottom: 6 }}>
              {Array.from({ length: colCount }).map((_, colIdx) => {
                const colNum = colIdx + 1;
                const vip = isVip(rowChar, colNum);
                return (
                  <div
                    key={colIdx}
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 6,
                      background: vip ? "#7c3aed" : "#e5e7eb", // tím cho VIP, xám cho thường
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: "500",
                      color: vip ? "#fff" : "#111827",
                      border: "1px solid #d1d5db",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                  >
                    {rowChar}
                    {colNum}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // Lấy danh sách ghế theo roomId
  const { data, isLoading, error } = useGetSeatsByRoomId(room?.id);


  // Tính toán khu vực ghế VIP
  const vipSeats = (data || []).filter(
    seat => seat.type && seat.type.trim().toLowerCase() === "vip"
  );

  const rowNumbers = vipSeats
    .map(seat => seat.row_number)
    .filter(r => typeof r === "string" && r.length > 0);

  const colNumbers = vipSeats
    .map(seat => Number(seat.seat_number))
    .filter(n => !isNaN(n));

  const vipArea = {
    vip_row_start: rowNumbers.length ? rowNumbers.reduce((a, b) => a < b ? a : b) : null,
    vip_row_end: rowNumbers.length ? rowNumbers.reduce((a, b) => a > b ? a : b) : null,
    vip_col_start: colNumbers.length ? Math.min(...colNumbers) : null,
    vip_col_end: colNumbers.length ? Math.max(...colNumbers) : null,
  };

  const vipAreaFromForm = {
    vip_row_start: formData.vip_row_start?.toUpperCase(),
    vip_row_end: formData.vip_row_end?.toUpperCase(),
    vip_col_start: Number(formData.vip_col_start),
    vip_col_end: Number(formData.vip_col_end),
  };
  useEffect(() => {
    if (isEditMode && room && vipArea) {
      console.log("room data:", room, vipArea);
      setFormData({
        id: room.id,
        name: room.name || "",
        capacity: room.capacity || "",
        type: room.type?.toLowerCase() || "2d",
        row_count: room.row_count || "",
        column_count: room.column_count || "",
        is_active: room.is_active,
        vip_row_start: vipArea.vip_row_start ? String(vipArea.vip_row_start) : "",
        vip_row_end: vipArea.vip_row_end ? String(vipArea.vip_row_end) : "",
        vip_col_start: vipArea.vip_col_start ? String(vipArea.vip_col_start) : "",
        vip_col_end: vipArea.vip_col_end ? String(vipArea.vip_col_end) : "",
      });
    } else if (isAddMode) {
      resetForm();
    }
  }, [room, isEditMode, isAddMode]);

  if (isAddMode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto scrollbar-none ">
          <DialogHeader>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row w-full overflow-hidden gap-4">
              {/* Bên trái: Ma trận ghế (cuộn ngang nếu cần) */}
              <div className="w-full md:w-3/4 bg-gray-100 rounded-xl p-8 overflow-x-auto">
                <div className="flex flex-col items-center min-w-max">
                  {renderSeatMatrix(formData.row_count, formData.column_count, vipAreaFromForm)}
                </div>
              </div>
              {/* Bên phải: Form nhập liệu */}
              <div className="w-full md:w-1/4 space-y-4 bg-white p-6 shadow-lg border rounded-2xl overflow-hidden">
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
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Khu vực ghế VIP
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="vip_row_start"
                        className="font-semibold text-gray-700"
                      >
                        Hàng bắt đầu
                      </Label>
                      <Input
                        id="vip_row_start"
                        name="vip_row_start"
                        type="text"
                        value={formData.vip_row_start ?? ""}
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
                        Hàng kết thúc
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
                        Cột bắt đầu
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
                        Cột kết thúc
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
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                {isViewMode ? "Đóng" : "Hủy"}
              </Button>
              <Button type="submit">Thêm phòng</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  } else if (isEditMode) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto scrollbar-none ">
          <DialogHeader>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row w-full overflow-hidden gap-4">
              {/* Bên trái: Ma trận ghế (cuộn ngang nếu cần) */}
              <div className="w-full md:w-3/4 bg-gray-100 rounded-xl p-8 overflow-x-auto">
                <div className="flex flex-col items-center min-w-max">
                  {renderSeatMatrix(formData.row_count, formData.column_count, vipAreaFromForm)}
                </div>
              </div>
              {/* Bên phải: Form nhập liệu */}
              <div className="w-full md:w-1/4 space-y-4 bg-white p-6 shadow-lg border rounded-2xl overflow-hidden">
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
                <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Khu vực ghế VIP
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_row_start"
                      className="font-semibold text-gray-700"
                    >
                      Hàng bắt đầu
                    </Label>
                    <Input
                      id="vip_row_start"
                      name="vip_row_start"
                      type="text"
                      value={formData.vip_row_start ?? ""}
                      onChange={handleChange}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_row_end"
                      className="font-semibold text-gray-700"
                    >
                      Hàng kết thúc
                    </Label>
                    <Input
                      id="vip_row_end"
                      name="vip_row_end"
                      type="text"
                      value={formData.vip_row_end}
                      onChange={handleChange}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_col_start"
                      className="font-semibold text-gray-700"
                    >
                      Cột bắt đầu
                    </Label>
                    <Input
                      id="vip_col_start"
                      name="vip_col_start"
                      type="number"
                      value={formData.vip_col_start}
                      onChange={handleChange}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_col_end"
                      className="font-semibold text-gray-700"
                    >
                      Cột kết thúc
                    </Label>
                    <Input
                      id="vip_col_end"
                      name="vip_col_end"
                      type="number"
                      value={formData.vip_col_end}
                      onChange={handleChange}
                      className="h-12 text-base"
                    />
                  </div>
                </div>
              </div>
                
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                {isViewMode ? "Đóng" : "Hủy"}
              </Button>
              <Button type="submit">
                  Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-8xl max-h-[90vh] overflow-y-auto scrollbar-none ">
          <DialogHeader>
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col md:flex-row w-full overflow-hidden gap-4">
            {/* Bên trái: Ma trận ghế (cuộn ngang nếu cần) */}
            <div className="w-full md:w-3/4 bg-gray-100 rounded-xl p-8 overflow-x-auto">
              <div className="flex flex-col items-center min-w-max">
                {renderSeatMatrix(room?.row_count, room?.column_count, vipArea)}
              </div>
            </div>

            {/* Bên phải: Form nhập liệu (không cuộn ngang) */}
            <div className="w-full md:w-1/4 space-y-4 bg-white p-6 shadow-lg border rounded-2xl overflow-hidden">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold text-gray-700">
                  Tên phòng
                </Label>
                <Input value={room?.name || ""} readOnly disabled />
              </div>

              <div className="space-y-2">
                <Label className="font-semibold text-gray-700">Sức chứa</Label>
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
                  <Label className="font-semibold text-gray-700">Số hàng</Label>
                  <Input
                    value={room?.row_count || ""}
                    readOnly
                    disabled
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-gray-700">Số cột</Label>
                  <Input
                    value={room?.column_count || ""}
                    readOnly
                    disabled
                    className="h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="font-semibold text-gray-700">
                  Trạng thái
                </Label>
                <Input
                  value={room?.is_active ? "Hoạt động" : "Dừng hoạt động"}
                  readOnly
                  disabled
                  className="h-12 text-base"
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Khu vực ghế VIP
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_row_start"
                      className="font-semibold text-gray-700"
                    >
                      Hàng bắt đầu
                    </Label>
                    <Input
                      value={vipArea.vip_row_start ?? ""}
                      readOnly
                      disabled
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_row_end"
                      className="font-semibold text-gray-700"
                    >
                      Hàng kết thúc
                    </Label>
                    <Input
                      value={vipArea.vip_row_end ?? ""}
                      readOnly
                      disabled
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_col_start"
                      className="font-semibold text-gray-700"
                    >
                      Cột bắt đầu
                    </Label>
                    <Input
                      value={vipArea.vip_col_start ?? ""}
                      readOnly
                      disabled
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vip_col_end"
                      className="font-semibold text-gray-700"
                    >
                      Cột kết thúc
                    </Label>
                    <Input
                      value={vipArea.vip_col_end ?? ""}
                      readOnly
                      disabled
                      className="h-12 text-base"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
