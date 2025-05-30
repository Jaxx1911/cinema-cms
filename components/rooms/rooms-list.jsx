"use client";

import { useState, useEffect } from "react";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSeatsByRoomId } from "@/hooks/use-seat";
import { useGetRooms, useCreateRoom, useUpdateRoom, useDeleteRoom } from "@/hooks/use-room";

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
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle } from "lucide-react";

function generateAllSeats(rowCount, colCount, vipArea) {
  const seats = [];
  const startChar = "A".charCodeAt(0);
  for (let row = 0; row < rowCount; row++) {
    const rowChar = String.fromCharCode(startChar + row);
    for (let col = 1; col <= colCount; col++) {
      let type = "standard";
      if (
        vipArea &&
        rowChar >= vipArea.vip_row_start &&
        rowChar <= vipArea.vip_row_end &&
        col >= Number(vipArea.vip_col_start) &&
        col <= Number(vipArea.vip_col_end)
      ) {
        type = "VIP";
      }
      seats.push({
        row_number: rowChar,
        seat_number: col,
        type,
      });
    }
  }
  return seats;
}

export function RoomsList({ cinemaId }) {
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [dialogMode, setDialogMode] = useState("view");
  const [seatsFromApi, setSeatsFromApi] = useState([]);

  const { mutate: deleteRoom, isLoading: isDeleting } = useDeleteRoom();
  const { mutate: createRoom, isLoading: isCreating } = useCreateRoom();
  const { mutate: updateRoom, isLoading: isUpdating } = useUpdateRoom();
  const { data: rooms, isLoading } = useGetRooms(cinemaId);
  const { data, isLoading: seatsLoading, error } = useGetSeatsByRoomId(selectedRoom?.id);

  const handleDeleteClick = (id) => {
    setRoomToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    deleteRoom({ id: roomToDelete }, {
      onSuccess: () => {
        toast({
          title: "Thành công",
          description: "Xóa phòng chiếu thành công",
          variant: "default",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });
      },
      onError: (error) => {
        toast({
          title: "Lỗi",
          description: error.message || "Có lỗi xảy ra khi xóa phòng chiếu",
          variant: "default",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
        });
      },
    });
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

  const handleSaveRoom = (room) => {
    console.log("room khi update:", room);
    if (dialogMode === "add") {
      const payload = {
        ...room,
        row_count: Number(room.row_count),
        column_count: Number(room.column_count),
        capacity: Number(room.row_count) * Number(room.column_count),
        cinema_id: cinemaId,
        seats: generateAllSeats(
          Number(room.row_count),
          Number(room.column_count),
          {
            vip_row_start: room.vip_row_start?.toUpperCase(),
            vip_row_end: room.vip_row_end?.toUpperCase(),
            vip_col_start: Number(room.vip_col_start),
            vip_col_end: Number(room.vip_col_end),
          }
        ),
      }
      console.log("Payload gửi lên:", payload);
      createRoom(payload, {
        onSuccess: (data) => {
          toast({
            title: "Thành công",
            description: "Thêm phòng chiếu thành công",
            variant: "default",
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          });
          setIsRoomDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi thêm phòng chiếu",
            variant: "destructive",
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          });
        },
      });
    } else if (dialogMode === "edit") {
      const updatedSeats = generateAllSeats(
        Number(room.row_count),
        Number(room.column_count),
        {
          vip_row_start: room.vip_row_start?.toUpperCase(),
          vip_row_end: room.vip_row_end?.toUpperCase(),
          vip_col_start: Number(room.vip_col_start),
          vip_col_end: Number(room.vip_col_end),
        }
      ).map(seat => {
        const oldSeat = data.find(
          s => s.row_number === seat.row_number && s.seat_number === seat.seat_number
        );
        return {
          id: oldSeat ? oldSeat.id : undefined,
          row_number: seat.row_number,
          seat_number: seat.seat_number,
          type: seat.type,
        };
      });
      const payload = {
        name: room.name,
        type: room.type,
        is_active: room.is_active,
        seats: updatedSeats,
      };
      updateRoom({ id: room.id, roomData: payload }, {
        onSuccess: (data) => {
          toast({
            title: "Thành công",
            description: "Cập nhật phòng chiếu thành công",
            variant: "default",
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          });
          setIsRoomDialogOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Lỗi",
            description: error.message || "Có lỗi xảy ra khi cập nhật phòng chiếu",
            variant: "destructive",
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          });
        },
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
                    <TableHead >Tên phòng</TableHead>
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
                    rooms.sort((a, b) => a.name.localeCompare(b.name)).map((room, index) => (
                      <TableRow key={room.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-blue-600 truncate max-w-[200px]">
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
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
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
        setDialogMode={setDialogMode}
        setIsRoomDialogOpen={setIsRoomDialogOpen}
        onSave={handleSaveRoom}
        cinemaId={cinemaId}
      />
    </>
  );
}
