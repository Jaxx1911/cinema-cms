"use client"

import { useState, useMemo, useEffect } from "react"
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAllPayments } from "@/hooks/use-payment"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function InvoiceList({
  searchTerm,
  statusFilter,
  debouncedSearchTerm,
  searchInputRef
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch data using the hook with pagination
  const { data: paymentsData, isLoading, error, refetch } = useAllPayments(currentPage, itemsPerPage)

  useEffect(() => {
    refetch(currentPage, itemsPerPage)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [currentPage, itemsPerPage, refetch, debouncedSearchTerm, statusFilter])

  // Map API data to match the expected format
  const invoices = useMemo(() => {
    if (!paymentsData?.body?.data) return []
    
    return paymentsData.body.data.map((payment) => ({
      id: payment.id,
      transactionId: payment.transaction_id,
      date: format(new Date(payment.payment_time), "dd/MM/yyyy", { locale: vi }),
      time: format(new Date(payment.payment_time), "HH:mm", { locale: vi }),
      customer: payment.customer.name,
      customerEmail: payment.customer.email,
      customerPhone: payment.customer.phone,
      ticketPrice: payment.total_ticket_price,
      concessionAmount: payment.total_combo_price,
      totalAmount: payment.amount,
      status: payment.status,
      orderId: payment.order_id,
      userId: payment.user_id,
      discount: payment.discount ? `${payment.discount.percentage}%` : "-:-",
    }))
  }, [paymentsData])

  // Filter invoices based on search and status
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch = !debouncedSearchTerm || 
        invoice.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        invoice.transactionId.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        invoice.customerEmail.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        invoice.customerPhone.includes(debouncedSearchTerm)

      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [invoices, debouncedSearchTerm, statusFilter])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, statusFilter])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Thành công"
      case "failed":
        return "Thất bại"
      case "pending":
        return "Đang xử lý"
      default:
        return status
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Calculate total pages from API response
  const totalCount = paymentsData?.body?.total_count || 0
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Mã giao dịch</TableHead>
              <TableHead>Ngày/Giờ thanh toán</TableHead>
              <TableHead>Tên khách hàng</TableHead>
              <TableHead>Tiền vé</TableHead>
              <TableHead>Tiền combo</TableHead>
              <TableHead>Thông tin discount</TableHead>
              <TableHead>Tổng tiền hóa đơn</TableHead>
              <TableHead className="text-center">Trạng thái giao dịch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-blue-600">{invoice.transactionId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{invoice.date}</span>
                      <span className="text-sm text-gray-500">{invoice.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{invoice.customer}</span>
                      <span className="text-sm text-gray-500">{invoice.customerEmail}</span>
                      <span className="text-sm text-gray-500">{invoice.customerPhone}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.ticketPrice)}</TableCell>
                  <TableCell>{formatCurrency(invoice.concessionAmount)}</TableCell>
                  <TableCell className="text-sm">{invoice.discount}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(invoice.totalAmount)}</TableCell>
                  <TableCell className="text-center">
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          {filteredInvoices.length > 0 ? `Hiển thị ${startIndex + 1}-${Math.min(endIndex, filteredInvoices.length)} của ${totalCount} hóa đơn` : "Không có hóa đơn nào"}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
} 