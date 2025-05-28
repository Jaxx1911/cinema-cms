"use client"

import { useState, useMemo } from "react"
import { X, Download, Search, Filter, Calendar, Receipt, User, CreditCard, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePaymentsByCinema } from "@/hooks/use-payment"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function CinemaInvoicesDialog({ isOpen, onClose, cinema, startDate, endDate }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch data using the hook
  const { data: paymentsData, isLoading, error } = usePaymentsByCinema(
    cinema?.id,
    startDate ? startDate.toISOString() : null,
    endDate ? endDate.toISOString() : null
  )

  // Map API data to match the expected format
  const invoices = useMemo(() => {
    if (!paymentsData?.body) return []
    
    return paymentsData.body.map((payment, index) => ({
      date: format(new Date(payment.date), "dd/MM/yyyy", { locale: vi }),
      time: format(new Date(payment.date), "HH:mm", { locale: vi }),
      customer: payment.user_name,
      movie: payment.movie_name,
      ticketCount: payment.tickets.length,
      ticketPrice: payment.total_amount - payment.total_combo_amount,
      concessionAmount: payment.total_combo_amount,
      totalAmount: payment.total_amount,
      paymentMethod: "Thanh toán online", // API không có thông tin này
      status: payment.status === "success" ? "Đã thanh toán" : "Đã hủy",
      screen: payment.room_name,
      seats: payment.tickets.join(", "),
    }))
  }, [paymentsData, cinema?.id])

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.movie.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [invoices, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
        return "bg-green-100 text-green-800"
      case "Đã hủy":
        return "bg-red-100 text-red-800"
      case "Hoàn tiền":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleExport = () => {
    alert(`Xuất danh sách hóa đơn của ${cinema?.name}`)
  }

  if (!cinema) return null

  // Tính toán thống kê
  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
  const totalTickets = filteredInvoices.reduce((sum, inv) => sum + inv.ticketCount, 0)
  const totalConcession = filteredInvoices.reduce((sum, inv) => sum + inv.concessionAmount, 0)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Danh sách hóa đơn - {cinema.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                <div className="text-lg">Đang tải dữ liệu...</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-2">
                <AlertCircle className="h-12 w-12 text-red-600" />
                <div className="text-lg text-red-600">Có lỗi xảy ra khi tải dữ liệu</div>
              </div>
            </div>
          ) : (
            <>

              {/* Bộ lọc và tìm kiếm */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Lọc:</span>
                  </div>

                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm hóa đơn, khách hàng, phim..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="success">Thành công</SelectItem>
                      <SelectItem value="failed">Thất bại</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bảng hóa đơn */}
              <div className="flex-1 overflow-auto">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-gray-50 sticky top-0">
                      <TableRow>
                        <TableHead>Ngày/Giờ</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Phim</TableHead>
                        <TableHead>Phòng/Ghế</TableHead>
                        <TableHead>Số vé</TableHead>
                        <TableHead>Tiền vé</TableHead>
                        <TableHead>Bắp nước</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={11} className="h-24 text-center text-gray-500">
                            Không có dữ liệu
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{invoice.date}</span>
                                <span className="text-sm text-gray-500">{invoice.time}</span>
                              </div>
                            </TableCell>
                            <TableCell>{invoice.customer}</TableCell>
                            <TableCell className="max-w-[150px] truncate" title={invoice.movie}>
                              {invoice.movie}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{invoice.screen}</span>
                                <span className="text-sm text-gray-500">{invoice.seats}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{invoice.ticketCount}</TableCell>
                            <TableCell>{formatCurrency(invoice.ticketPrice)}</TableCell>
                            <TableCell>{formatCurrency(invoice.concessionAmount)}</TableCell>
                            <TableCell className="font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredInvoices.length)} trên{" "}
                    {filteredInvoices.length} hóa đơn
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </Button>
                    <div className="text-sm">
                      Trang {currentPage} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
