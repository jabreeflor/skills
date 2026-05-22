"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Monthly revenue over the last 6 months"

const chartData = [
  { month: "Nov 2024", revenue: 98200 },
  { month: "Dec 2024", revenue: 110540 },
  { month: "Jan 2025", revenue: 105800 },
  { month: "Feb 2025", revenue: 119300 },
  { month: "Mar 2025", revenue: 124560 },
  { month: "Apr 2025", revenue: 142380 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>
          Revenue trend over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value) =>
                    [`$${Number(value).toLocaleString()}`, "Revenue"]
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
