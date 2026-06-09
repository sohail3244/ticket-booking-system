"use client";

import {
  TableShell,
  TableHead,
  TableBody,
  TableRow,
  TableEmpty,
  TableLoader,
} from "@/components/table/core";

import { useState, useMemo } from "react";

export default function ScanLogTable({
  data = [],
  loading = false,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // Ek page par kitne logs dikhane hain

  // ✅ 1. Filtered Logs (Search logic)
  const filteredLogs = useMemo(() => {
    return data.filter((log) =>
      log.ticket?.id?.toLowerCase().includes(search.toLowerCase()) ||
      log.type?.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  // ✅ 2. Pagination Calculations
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  
  // Current page ka data nikalne ke liye slice
  const startIndex = (page - 1) * itemsPerPage;
  const currentTableData = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  // ✅ 3. Reset to page 1 when searching
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className=" bg-slate-50 min-h-screen">
      <TableShell
        title="Scan Logs"
        searchProps={{
          value: search,
          onChange: handleSearch,
          onClear: () => { setSearch(""); setPage(1); },
          placeholder: "Search ticket or type...",
        }}
        paginationProps={{
          page,
          totalPages,
          // Next button logic
          onNext: () => setPage((p) => Math.min(p + 1, totalPages)),
          // Prev button logic
          onPrev: () => setPage((p) => Math.max(p - 1, 1)),
        }}
      >
        <TableHead columns={["Ticket ID", "Type", "Scanned At"]} />

        <TableBody>
          {loading ? (
            <TableLoader rows={itemsPerPage} />
          ) : currentTableData.length === 0 ? (
            <TableEmpty colSpan={3} message="No scan logs found" />
          ) : (
            currentTableData.map((log) => (
              <TableRow key={log.id}>
                {/* Ticket ID */}
                <td className="px-5 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {log.ticket?.id || "N/A"}
                </td>

                {/* Type */}
                <td className="px-5 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                      log.type === "ENTRY"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-600 border border-red-200"
                    }`}
                  >
                    {log.type}
                  </span>
                </td>

                {/* Scanned At */}
                <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                  {log.scannedAt 
                    ? new Date(log.scannedAt).toLocaleString("en-IN", {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      }) 
                    : "---"}
                </td>
              </TableRow>
            ))
          )}
        </TableBody>
      </TableShell>
    </div>
  );
}