"use client"

import { X, Check, Info, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from "date-fns"

export function BatchSchedulePreview({
  previewShowtimes,
  selectedMovieDetails,
  startDate,
  endDate,
  checkingStatus,
  isCheckingAll,
  onCheckAllSchedules,
  onBackToSchedule
}) {
  if (previewShowtimes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">Không có suất chiếu nào được tạo</div>
        <Button variant="outline" onClick={onBackToSchedule}>
          Quay lại thiết lập lịch
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Xem trước lịch chiếu ({previewShowtimes.length} suất chiếu)</h3>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {format(startDate, "dd/MM/yyyy")} - {format(endDate, "dd/MM/yyyy")}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCheckAllSchedules}
            disabled={isCheckingAll}
          >
            {isCheckingAll ? "Đang kiểm tra..." : "Kiểm tra lịch"}
          </Button>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader className="bg-gray-50 sticky top-0">
              <TableRow>
                <TableHead>Phim</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Phòng chiếu</TableHead>
                <TableHead>Giờ bắt đầu</TableHead>
                <TableHead>Giờ kết thúc</TableHead>
                <TableHead>Giá vé (VND)</TableHead>
                <TableHead>Kiểm tra</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewShowtimes.map((showtime) => (
                <TableRow key={showtime.id}>
                  <TableCell>{selectedMovieDetails.title}</TableCell>
                  <TableCell>{format(showtime.date, "dd/MM/yyyy")}</TableCell>
                  <TableCell>{showtime.screenName}</TableCell>
                  <TableCell>{format(showtime.startTime, "HH:mm")}</TableCell>
                  <TableCell>{format(showtime.endTime, "HH:mm")}</TableCell>
                  <TableCell>{showtime.price}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center justify-center">
                            {checkingStatus[showtime.id]?.isValid ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : checkingStatus[showtime.id] ? (
                              <X className="h-4 w-4 text-red-600" />
                            ) : (
                              <Minus className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </TooltipTrigger>
                        {checkingStatus[showtime.id] && !checkingStatus[showtime.id].isValid && (
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">Lịch chiếu trùng:</p>
                              {checkingStatus[showtime.id].conflicts.map((conflict, index) => (
                                <p key={index} className="text-sm">
                                  {conflict.movie_name} - {format(new Date(conflict.start_time), "HH:mm")} đến {format(new Date(conflict.end_time), "HH:mm")}
                                </p>
                              ))}
                            </div>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle>Thông tin</AlertTitle>
        <AlertDescription>
          Tất cả các suất chiếu sẽ được thêm vào hệ thống khi bạn nhấn nút "Thêm suất chiếu". Vui lòng kiểm
          tra kỹ trước khi xác nhận.
        </AlertDescription>
      </Alert>
    </div>
  )
} 