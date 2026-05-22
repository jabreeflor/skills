"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const schema = z.object({
  id: z.number(),
  email: z.string(),
  plan: z.string(),
  signupDate: z.string(),
  status: z.string(),
})

type Signup = z.infer<typeof schema>

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    Active: "default",
    Trial: "secondary",
    Churned: "destructive",
  }
  return (
    <Badge variant={variants[status] ?? "outline"}>
      {status}
    </Badge>
  )
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    Starter: "text-blue-600 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950",
    Pro: "text-violet-600 border-violet-200 bg-violet-50 dark:text-violet-400 dark:border-violet-800 dark:bg-violet-950",
    Enterprise: "text-amber-600 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950",
  }
  return (
    <Badge
      variant="outline"
      className={colors[plan] ?? ""}
    >
      {plan}
    </Badge>
  )
}

const columns: ColumnDef<Signup>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => <PlanBadge plan={row.original.plan} />,
  },
  {
    accessorKey: "signupDate",
    header: "Signup Date",
    cell: ({ row }) => {
      const date = new Date(row.original.signupDate)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
]

export function DataTable({ data: initialData }: { data: Signup[] }) {
  const [data] = React.useState(() => initialData)
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Card className="mx-4 lg:mx-6">
      <CardHeader>
        <CardTitle>Recent Signups</CardTitle>
        <CardDescription>Latest users who joined the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
