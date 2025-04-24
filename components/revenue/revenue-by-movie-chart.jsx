"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

// Mock data for revenue by movie
const data = [
  { name: "Avengers: Endgame", total: 1250000000 },
  { name: "The Dark Knight", total: 980000000 },
  { name: "Inception", total: 850000000 },
  { name: "Parasite", total: 720000000 },
  { name: "Joker", total: 680000000 },
  { name: "Dune", total: 520000000 },
  { name: "Spider-Man", total: 480000000 },
  { name: "Black Panther", total: 420000000 },
  { name: "Interstellar", total: 380000000 },
  { name: "The Matrix", total: 320000000 },
]

export function RevenueByMovieChart() {
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
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatYAxis}
        />
        <YAxis
          dataKey="name"
          type="category"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={150}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}
