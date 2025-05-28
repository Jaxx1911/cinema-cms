"use client"

import { useState, useEffect, useRef } from "react"
import InvoiceFilter from "@/components/invoices/invoice-filter"
import InvoiceList from "@/components/invoices/invoice-list"

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const searchInputRef = useRef(null)

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý hóa đơn</h2>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <InvoiceFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchInputRef={searchInputRef}
        />
        <InvoiceList 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          debouncedSearchTerm={debouncedSearchTerm}
          searchInputRef={searchInputRef}
        />
      </div>
    </div>
  )
} 