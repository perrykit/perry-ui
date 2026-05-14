/**
 * Data Table Block
 *
 * A sortable table with pagination.
 */

import { VStack } from "perry/ui"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export interface DataTableProps {
  columns: DataTableColumn[]
  data: DataTableRow[]
  onSort?: (column: string) => void
  onPageChange?: (page: number) => void
  pageSize?: number
}

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
}

export interface DataTableRow {
  [key: string]: string | number
}

export function DataTable(props: DataTableProps) {
  const {
    columns,
    data,
    onSort = (col) => console.log("Sort:", col),
    onPageChange = (page) => console.log("Page:", page),
    pageSize = 10
  } = props

  let currentPage = 1
  const totalPages = Math.ceil(data.length / pageSize)

  function getPageData(): DataTableRow[] {
    const start = (currentPage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }

  return VStack(16, [
    // Header row
    HStack(8, [
      ...columns.map(col =>
        Button({
          children: col.label,
          variant: "ghost",
          onPress: () => col.sortable && onSort(col.key)
        })
      )
    ]),

    Separator(),

    // Data rows
    VStack(8, [
      ...getPageData().map(row =>
        HStack(8, [
          ...columns.map(col =>
            Label({
              children: String(row[col.key] || ""),
              variant: "body"
            })
          )
        ])
      )
    ]),

    Separator(),

    // Pagination
    HStack(8, [
      Button({
        children: "Previous",
        variant: "outline",
        onPress: () => onPageChange(Math.max(1, currentPage - 1))
      }),
      Label({
        children: `Page ${currentPage} of ${totalPages}`,
        variant: "muted"
      }),
      Button({
        children: "Next",
        variant: "outline",
        onPress: () => onPageChange(Math.min(totalPages, currentPage + 1))
      })
    ])
  ])
}
