"use client";

import {
  TableShell,
  TableHead,
  TableBody,
  TableRow,
  TableEmpty,
  TableLoader,
} from "./core";

import ActionMenu from "../common/ActionMenu";
import { Eye, XCircle } from "lucide-react";
import { useState, useMemo } from "react";
import StatusBadge from "../common/StatusBadge";

export default function BookingTable({
  data = [],
  isLoading = false,
  onView,
  onCancel,
  paginationProps 
}) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      [item.name, item.email, item.place?.name].some((val) =>
        val?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const columns = [
    "Customer",
    "Phone",
    "Email",
    "Place",
    "Slot",
    "Total Tickets",
    "Amount",
    "Booking Type",
    "Transaction ID",
    "Payment ID",
    "Status",
    "Created",
    "Action",
  ];

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
      {/* Remove fixed min-width, use w-full instead */}
      <div className="w-full">
        <TableShell
          title="Bookings"
          subtitle={`${filteredData.length} total bookings`}
          searchProps={{
            value: search,
            onChange: (e) => setSearch(e.target.value),
            onClear: () => setSearch(""),
            placeholder: "Search name, email or place...",
          }}
          paginationProps={paginationProps}
        >
          <TableHead columns={columns} />

          <TableBody>
            {isLoading ? (
              <TableLoader rows={5} />
            ) : filteredData.length === 0 ? (
              <TableEmpty colSpan={13} message="No bookings found" />
            ) : (
              filteredData.map((booking) => (
                <TableRow
                  key={booking.id}
                  renderActions={() => (
                    <ActionMenu
                      items={[
                        {
                          label: "View",
                          icon: Eye,
                          onClick: () => onView?.(booking),
                        },
                        {
                          label: "Cancel",
                          icon: XCircle,
                          danger: true,
                          onClick: () => onCancel?.(booking),
                        },
                      ]}
                    />
                  )}
                >
                  {/* Customer Column - Responsive width */}
                  <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
                    <div className="flex flex-col space-y-1">
                      <p className="font-semibold text-slate-900">
                        {booking.name}
                      </p>
                    </div>
                  </td>

                  {/* Phone Column */}
                  <td className="px-4 py-3 text-slate-600 md:px-6 md:py-4">
                    {booking.phone || "N/A"}
                  </td>

                  {/* Email Column - New Column */}
                  <td className="px-4 py-3 text-slate-600 md:px-6 md:py-4">
                    <span className="break-all inline-block max-w-50">
                      {booking.email || "N/A"}
                    </span>
                  </td>

                  {/* Place Column */}
                  <td className="px-4 py-3 text-slate-700 md:px-6 md:py-4">
                    {booking.place?.name || "N/A"}
                  </td>

                  {/* Slot Column */}
                  <td className="px-4 py-3 text-slate-500 md:px-6 md:py-4">
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {booking.slotDateTime?.split("T")[0]}
                      </span>
                      <span className="text-xs text-slate-400">
                        {booking.slotDateTime?.split("T")[1]?.slice(0, 5)}
                      </span>
                    </div>
                  </td>

                  {/* Total Tickets Column */}
                  <td className="px-4 py-3 text-slate-600 text-center md:px-6 md:py-4">
                    {booking.totalSeats || 0}
                  </td>

                  {/* Amount Column */}
                  <td className="px-4 py-3 font-semibold text-slate-800 md:px-6 md:py-4">
                    ₹{booking.totalAmount?.toLocaleString() || 0}
                  </td>

                  {/* Booking Type Column */}
                  <td className="px-4 py-3 md:px-6 md:py-4">
                    <span className="inline-flex px-2 py-1 rounded-md text-[11px] font-medium bg-violet-50 text-violet-700 border border-violet-100 whitespace-nowrap">
                      {booking.bookingType || "TICKET"}
                    </span>
                  </td>

                  {/* Transaction ID Column */}
                  <td className="px-4 py-3 text-xs font-mono text-slate-500 md:px-6 md:py-4">
                    <span className="break-all max-w-37.5 inline-block">
                      {booking.txnId || "N/A"}
                    </span>
                  </td>

                  {/* Payment ID Column */}
                  <td className="px-4 py-3 text-xs font-mono text-slate-500 md:px-6 md:py-4">
                    <span className="break-all max-w-37.5 inline-block">
                      {booking.paymentId || "N/A"}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="px-4 py-3 md:px-6 md:py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  {/* Created Column */}
                  <td className="px-4 py-3 text-slate-500 text-sm md:px-6 md:py-4 whitespace-nowrap">
                    {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </TableShell>
      </div>
    </div>
  );
}