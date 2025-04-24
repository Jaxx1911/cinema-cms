"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// Mock data for different periods
const weekData = [
  { name: "Thứ 2", total: 120000000 },
  { name: "Thứ 3", total: 142000000 },
  { name: "Thứ 4", total: 158000000 },
  { name: "Thứ 5", total: 170000000 },
  { name: "Thứ 6", total: 190000000 },
  { name: "Thứ 7", total: 210000000 },
  { name: "CN", total: 250000000 },
]

const monthData = [
  { name: "01/04", total: 120000000 },
  { name: "02/04", total: 142000000 },
  { name: "03/04", total: 158000000 },
  { name: "04/04", total: 170000000 },
  { name: "05/04", total: 190000000 },
  { name: "06/04", total: 210000000 },
  { name: "07/04", total: 250000000 },
  { name: "08/04", total: 230000000 },
  { name: "09/04", total: 245000000 },
  { name: "10/04", total: 255000000 },
  { name: "11/04", total: 270000000 },
  { name: "12/04", total: 290000000 },
  { name: "13/04", total: 285000000 },
  { name: "14/04", total: 295000000 },
]

const quarterData = [
  { name: "Tuần 1", total: 820000000 },
  { name: "Tuần 2", total: 920000000 },
  { name: "Tuần 3", total: 880000000 },
  { name: "Tuần 4", total: 950000000 },
  { name: "Tuần 5", total: 1020000000 },
  { name: "Tuần 6", total: 980000000 },
  { name: "Tuần 7", total: 1050000000 },
  { name: "Tuần 8", total: 1120000000 },
  { name: "Tuần 9", total: 1080000000 },
  { name: "Tuần 10", total: 1150000000 },
  { name: "Tuần 11", total: 1220000000 },
  { name: "Tuần 12", total: 1280000000 },
]

const yearData = [
  { name: "T1", total: 3200000000 },
  { name: "T2", total: 3500000000 },
  { name: "T3", total: 3800000000 },
  { name: "T4", total: 4100000000 },
  { name: "T5", total: 4500000000 },
  { name: "T6", total: 4800000000 },
  { name: "T7", total: 5200000000 },
  { name: "T8", total: 4900000000 },
  { name: "T9", total: 5100000000 },
  { name: "T10", total: 5400000000 },
  { name: "T11", total: 5800000000 },
  { name: "T12", total: 6200000000 },
]

export function RevenueChart({ period = "month" }) {
  // Select data based on period
  const data =
    period === "week" ? weekData : period === "month" ? monthData : period === "quarter" ? quarterData : yearData

  const formatYAxis = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`
    }
    return value
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-white p-2 shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              maximumFractionDigits: 0,
            }).format(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={period === "year" ? 30 : 20} />
      </BarChart>
    </ResponsiveContainer>
  )
}
