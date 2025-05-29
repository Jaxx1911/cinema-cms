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
    });
  };

  const handleClose = () => {
    if (isAddMode) {
      resetForm();
    }
    onClose();
  };

  const handleSwitchEdit = () => {
    setIsRoomDialogOpen(false);
    setDialogMode("edit");
    setIsRoomDialogOpen(true);
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

  const calculateVipArea = (rowCount, colCount) => {
    rowCount = Number(rowCount);
    colCount = Number(colCount);
    
    if (!rowCount || !colCount || rowCount < 5 || colCount < 7) {
      return {
        vip_row_start: null,
        vip_row_end: null,
        vip_col_start: null,
        vip_col_end: null,
      };
    }

    // VIP từ hàng D đến hàng cách hàng couple 1 hàng
    // Ví dụ: nếu có 7 hàng (A,B,C,D,E,F,G) thì couple là G, VIP từ D đến E (cách G 1 hàng là F)
    const vipRowStart = "D"; // Hàng D
    const vipRowEnd = String.fromCharCode(65 + rowCount - 3); // Hàng cuối -2 (cách couple 1 hàng)
    const vipColStart = 4;
    const vipColEnd = colCount - 3;

    return {
      vip_row_start: vipRowStart,
      vip_row_end: vipRowEnd,
      vip_col_start: vipColStart,
      vip_col_end: vipColEnd,
    };
  };

  function renderSeatMatrix(rowCount, colCount) {
    rowCount = Number(rowCount);
    colCount = Number(colCount);
    if (!rowCount || !colCount) return null;

    const vipArea = calculateVipArea(rowCount, colCount);

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

          // Hàng cuối: ghế đôi (couple)
          if (rowChar === lastRowChar) {
            const doubleSeats = [];
            for (let colIdx = 0; colIdx < colCount; colIdx += 2) {
              const colNum1 = colIdx + 1;
              const colNum2 = colIdx + 2;
              doubleSeats.push(
                <div
                  key={colIdx}
                  style={{
                    width: 86,
                    height: 40,
                    marginRight: 6,
                    background: "#77103C", // Màu đỏ cho ghế đôi
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

  // Lấy danh sách ghế theo roomId (chỉ để kiểm tra, không dùng cho VIP calculation)
  const { data, isLoading, error } = useGetSeatsByRoomId(room?.id);

  useEffect(() => {
    if (isEditMode && room) {
      console.log("room data:", room);
      setFormData({
        id: room.id,
        name: room.name || "",
        capacity: room.capacity || "",
        type: room.type?.toLowerCase() || "2d",
        row_count: room.row_count || "",
        column_count: room.column_count || "",
        is_active: room.is_active,
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
                  {renderSeatMatrix(formData.row_count, formData.column_count)}
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
                
                {/* Thông tin VIP tự động */}
                {formData.row_count && formData.column_count && (
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Khu vực ghế VIP (Tự động)
                    </h3>
                    <div className="text-sm text-purple-700">
                      {(() => {
                        const vipArea = calculateVipArea(formData.row_count, formData.column_count);
                        if (!vipArea.vip_row_start) {
                          return "Cần ít nhất 5 hàng và 7 cột để có ghế VIP";
                        }
                        return `Hàng ${vipArea.vip_row_start} - ${vipArea.vip_row_end}, Cột ${vipArea.vip_col_start} - ${vipArea.vip_col_end}`;
                      })()}
                    </div>
                    <div className="text-xs text-purple-600">
                      • Ghế VIP: Từ hàng D đến hàng {(() => {
                        const vipArea = calculateVipArea(formData.row_count, formData.column_count);
                        return vipArea.vip_row_end || "N/A";
                      })()}, Cột {(() => {
                        const vipArea = calculateVipArea(formData.row_count, formData.column_count);
                        return vipArea.vip_col_start && vipArea.vip_col_end ? `${vipArea.vip_col_start}-${vipArea.vip_col_end}` : "N/A";
                      })()}<br/>
                      • Hàng cuối: Ghế đôi (Couple)
                    </div>
                  </div>
                )}
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
                  {renderSeatMatrix(formData.row_count, formData.column_count)}
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
                
                {/* Thông tin VIP tự động */}
                {formData.row_count && formData.column_count && (
                  <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Khu vực ghế VIP (Tự động)
                    </h3>
                    <div className="text-sm text-purple-700">
                      {(() => {
                        const vipArea = calculateVipArea(formData.row_count, formData.column_count);
                        if (!vipArea.vip_row_start) {
                          return "Cần ít nhất 5 hàng và 7 cột để có ghế VIP";
                        }
                        return `Hàng ${vipArea.vip_row_start} - ${vipArea.vip_row_end}, Cột ${vipArea.vip_col_start} - ${vipArea.vip_col_end}`;
                      })()}
                    </div>
                    <div className="text-xs text-purple-600">
                      • Ghế VIP: Từ hàng D đến hàng {(() => {
                        const vipArea = calculateVipArea(formData.row_count, formData.column_count);
                        return vipArea.vip_row_end || "N/A";
                      })()}, Cột {(() => {
                        const vipArea = calculateVipArea(formData.row_count, formData.column_count);
                        return vipArea.vip_col_start && vipArea.vip_col_end ? `${vipArea.vip_col_start}-${vipArea.vip_col_end}` : "N/A";
                      })()}<br/>
                      • Hàng cuối: Ghế đôi (Couple)
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                {isViewMode ? "Đóng" : "Hủy"}
              </Button>
              <Button type="submit" className="bg-blue-700 hover:bg-blue-800">
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
                {renderSeatMatrix(room?.row_count, room?.column_count)}
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
              
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800">
                  Khu vực ghế VIP
                </h3>
                {(() => {
                  const vipArea = calculateVipArea(room?.row_count, room?.column_count);
                  return vipArea.vip_row_start ? (
                    <div className="space-y-3">
                      <div className="text-sm text-purple-700">
                        Hàng {vipArea.vip_row_start} - {vipArea.vip_row_end}, 
                        Cột {vipArea.vip_col_start} - {vipArea.vip_col_end}
                      </div>
                      <div className="text-xs text-purple-600">
                        • Ghế VIP: Từ hàng {vipArea.vip_row_start} đến hàng {vipArea.vip_row_end}, 
                        Cột {vipArea.vip_col_start}-{vipArea.vip_col_end}<br/>
                        • Hàng cuối: Ghế đôi (Couple)
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      Cần ít nhất 5 hàng và 7 cột để có ghế VIP
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" className="border-gray-300 border bg-white text-gray-700 hover:bg-gray-100" onClick={handleClose}>
              Đóng
            </Button>
            <Button type="button" className="bg-blue-700 hover:bg-blue-800" onClick={handleSwitchEdit}>
              Chỉnh sửa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
