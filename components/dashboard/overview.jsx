"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "01/04",
    total: 120000000,
  },
  {
    name: "02/04",
    total: 142000000,
  },
  {
    name: "03/04",
    total: 158000000,
  },
  {
    name: "04/04",
    total: 170000000,
  },
  {
    name: "05/04",
    total: 190000000,
  },
  {
    name: "06/04",
    total: 210000000,
  },
  {
    name: "07/04",
    total: 250000000,
  },
  {
    name: "08/04",
    total: 230000000,
  },
  {
    name: "09/04",
    total: 245000000,
  },
  {
    name: "10/04",
    total: 255000000,
  },
  {
    name: "11/04",
    total: 270000000,
  },
  {
    name: "12/04",
    total: 290000000,
  },
  {
    name: "13/04",
    total: 285000000,
  },
  {
    name: "14/04",
    total: 295000000,
  },
]

export function Overview() {
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
        <div className="rounded-lg border bg-background p-2 shadow-sm">
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
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
