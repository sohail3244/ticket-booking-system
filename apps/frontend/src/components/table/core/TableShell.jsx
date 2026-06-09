"use client";

import SearchField from "@/components/ui/SearchField";
import TablePagination from "./TablePagination";

export default function TableShell({
  title,
  searchProps,
  children,
  paginationProps,
}) {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      {(title || searchProps) && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-5 border-b border-slate-100 gap-4">
          {title && (
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}

          {searchProps && (
            <div className="w-full sm:w-72">
              <SearchField {...searchProps} />
            </div>
          )}
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-sm text-left border-collapse">
          {children}
        </table>
      </div>

      {/* Footer / Pagination */}
      {paginationProps && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
          <TablePagination {...paginationProps} />
        </div>
      )}
    </div>
  );
}
