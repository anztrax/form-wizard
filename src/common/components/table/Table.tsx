"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
  PaginationState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { useState } from "react";
import { Button } from "../button/Button";
import { Select, SelectProps } from "../select/Select";
import styles from "./table.module.css";

export type TableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  className?: string;
  enablePagination?: boolean;
  pageSize?: number;
  pageIndex?: number;
  pageCount?: number;
  totalRows?: number;
  manualPagination?: boolean;
  onPaginationChange?: (pagination: PaginationState) => void;
  isLoading?: boolean;
  emptyMessage?: string;
};

const pageSizeOptions = [5, 10, 20, 30, 50, 100].map((size) => ({
  value: String(size),
  label: String(size),
}));

export function Table<TData>(props: TableProps<TData>) {
  const {
    data,
    columns,
    className = "",
    enablePagination = true,
    pageSize: initialPageSize = 10,
    pageIndex: initialPageIndex = 0,
    pageCount: controlledPageCount,
    totalRows,
    manualPagination = false,
    onPaginationChange,
    isLoading = false,
    emptyMessage = "No data available",
  } = props;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination && !manualPagination ? getPaginationRowModel() : undefined,
    manualPagination,
    pageCount: controlledPageCount ?? (totalRows ? Math.ceil(totalRows / pagination.pageSize) : undefined),
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      setPagination(newPagination);
      onPaginationChange?.(newPagination);
    },
  });

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();
  const pageCount = table.getPageCount();
  const currentPage = pagination.pageIndex + 1;

  const handlePageSizeChange: SelectProps['onChange'] = (value) => {
    if (value) {
      table.setPageSize(Number(value));
    }
  };

  return (
    <div className={`${styles.table} ${className}`.trim()}>
      {/* container */}
      <div className={styles["table__container"]}>
        <table className={styles["table__element"]}>
          <thead className={styles["table__head"]}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={styles["table__row"]}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles["table__header"]}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={styles["table__body"]}>
            {isLoading ? (
              <tr className={styles["table__row"]}>
                <td
                  colSpan={columns.length}
                  className={`${styles["table__cell"]} ${styles["table__cell--empty"]}`}
                >
                  <div className={styles["table__loading"]}>Loading...</div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr className={styles["table__row"]}>
                <td
                  colSpan={columns.length}
                  className={`${styles["table__cell"]} ${styles["table__cell--empty"]}`}
                >
                  <div className={styles["table__empty"]}>{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles["table__row"]}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles["table__cell"]}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* controls */}
      {enablePagination && (
        <div className={styles["table__pagination"]}>
          <div className={styles["table__pagination-info"]}>
            <span className={styles["table__pagination-text"]}>
              Page {currentPage} of {pageCount === 0 ? 1 : pageCount}
            </span>
            {totalRows !== undefined && (
              <span className={styles["table__pagination-text"]}>
                Total: {totalRows} {totalRows === 1 ? "row" : "rows"}
              </span>
            )}
          </div>

          <div className={styles["table__pagination-controls"]}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!canPreviousPage}
              className={styles["table__pagination-button"]}
            >
              <ChevronsLeft size={16} />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!canPreviousPage}
              className={styles["table__pagination-button"]}
            >
              <ChevronLeft size={16} />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!canNextPage}
              className={styles["table__pagination-button"]}
            >
              <ChevronRight size={16} />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!canNextPage}
              className={styles["table__pagination-button"]}
            >
              <ChevronsRight size={16} />
            </Button>
          </div>

          <div className={styles["table__pagination-size"]}>
            <label className={styles["table__pagination-label"]}>
              Rows per page:
            </label>
            <Select
              options={pageSizeOptions}
              value={String(pagination.pageSize)}
              onChange={handlePageSizeChange}
              size="sm"
              allowClear={false}
              className={styles["table__pagination-select"]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
