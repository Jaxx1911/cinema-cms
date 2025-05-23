"use client";

import { useState } from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoomDialog } from "./room-dialog";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RoomsTable({ rooms, cinemaId }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dialogMode, setDialogMode] = useState("view");

  const handleDeleteClick = (id) => {
    setRoomToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log(`Deleting room with ID: ${roomToDelete}`);
    setIsDeleteDialogOpen(false);
    setRoomToDelete(null);
  };

  const handleViewRoom = (room) => {
    setSelectedRoom(room);
    setDialogMode("view");
    setIsRoomDialogOpen(true);
  };

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setDialogMode("edit");
    setIsRoomDialogOpen(true);
  };

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setDialogMode("add");
    setIsRoomDialogOpen(true);
  };

  const buildRoomFormData = (roomData, includeCinemaId = false) => {
    const formData = new FormData();
    formData.append("name", roomData.name);
    formData.append("capacity", roomData.capacity);
    formData.append("type", roomData.type);
    formData.append("row_count", roomData.rows);
    formData.append("column_count", roomData.columns);
    formData.append("is_active", roomData.is_active);
    if (includeCinemaId) {
      formData.append("cinema_id", cinemaId);
    }
    return formData;
  };
  
  const handleSaveRoom = async (roomData) => {
    const isAdd = dialogMode === "add";
    const url = isAdd
      ? "/api/rooms"
      : `/api/rooms/${roomData.id}`;
    const method = isAdd ? "PUT" : "POST";
    const formData = buildRoomFormData(roomData, isAdd);
  
    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi không xác định");
      }
  
      const result = await response.json();
  
      toast({
        title: "Thành công",
        description: isAdd
          ? "Thêm phòng chiếu mới thành công"
          : "Cập nhật phòng chiếu thành công",
        variant: "default",
      });
  
      setIsRoomDialogOpen(false);
  
      // Cập nhật danh sách phòng chiếu (có thể refetch hoặc reload)
      window.location.reload(); // nếu chưa có refetch API
    } catch (error) {
      toast({
        title: "Lỗi",
        description:
          error.message ||
          (isAdd
            ? "Có lỗi xảy ra khi thêm phòng chiếu"
            : "Có lỗi xảy ra khi cập nhật phòng chiếu"),
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsContent value="rooms" className="space-y-4">
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách phòng chiếu
              </h3>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleAddRoom}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm phòng chiếu
              </Button>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">Tên phòng</TableHead>
                    <TableHead className="text-center">Sức chứa</TableHead>
                    <TableHead className="text-center">Loại phòng</TableHead>
                    <TableHead className="text-center">Số hàng</TableHead>
                    <TableHead className="text-center">Số cột</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="h-24 text-center text-gray-500"
                      >
                        Không có phòng chiếu nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    rooms.map((room, index) => (
                      <TableRow key={room.id} className="hover:bg-gray-50">
                        <TableCell
                          className="font-medium text-center"
                          title={`Room ID: ${room.id}`}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-blue-600 truncate max-w-[200px] text-center">
                          {room.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {room.capacity} ghế
                        </TableCell>
                        <TableCell className="text-center">
                          {room.type === "2d"
                            ? "2D"
                            : room.type === "3d"
                            ? "3D"
                            : room.type === "4dx"
                            ? "4DX"
                            : room.type === "imax"
                            ? "IMAX"
                            : room.type}
                        </TableCell>
                        <TableCell className="text-center">
                          {room.row_count}
                        </TableCell>
                        <TableCell className="text-center">
                          {room.column_count}
                        </TableCell>
                        <TableCell className="text-center">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              room.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {room.is_active ? " Hoạt động" : "Dừng hoạt động"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-blue-600"
                              onClick={() => handleViewRoom(room)}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Xem chi tiết</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-blue-600"
                              onClick={() => handleEditRoom(room)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Chỉnh sửa</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(room.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Xóa</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa phòng chiếu này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RoomDialog
        isOpen={isRoomDialogOpen}
        onClose={() => setIsRoomDialogOpen(false)}
        room={selectedRoom}
        mode={dialogMode}
        onSave={handleSaveRoom}
        cinemaId={cinemaId}
      />
    </>
  );
}
