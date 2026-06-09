"use client";

import React, { useState, useMemo, useEffect } from "react";
import BookingTable from "@/components/table/BookingTable";
import { useBookings } from "@/lib/queries/useBooking";
import StatCard from "@/components/common/StatCard";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data: bookings, isLoading } = useBookings();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const totalBookings = bookings?.length || 0;
  const today = new Date().toISOString().split("T")[0];

  const todayBookings =
    bookings?.filter((booking) => {
      const bookingDate = new Date(booking.createdAt)
        .toISOString()
        .split("T")[0];
      return bookingDate === today;
    }).length || 0;

  const successfulBookings =
    bookings?.filter(
      (booking) =>
        booking.status === "PAID" || booking.paymentStatus === "PAID",
    ).length || 0;

  const totalPages = Math.ceil(totalBookings / itemsPerPage) || 1;

  const paginatedBookings = useMemo(() => {
    if (!bookings) return [];
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return bookings.slice(start, end);
  }, [bookings, page]);

  useEffect(() => {
    setPage(1);
  }, [totalBookings]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="w-full mx-auto mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Booking Management
        </h1>
        <p className="text-slate-500 font-medium">
          Manage all bookings and ticket activities.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          percentage={12}
          isUp={true}
          trendingText="All booking records"
          subText="Total bookings received"
        />
        <StatCard
          title="Today's Bookings"
          value={todayBookings}
          percentage={8}
          isUp={true}
          trendingText="Today's activity"
          subText="Bookings created today"
        />
        <StatCard
          title="Successful Bookings"
          value={successfulBookings}
          percentage={5}
          isUp={true}
          trendingText="Completed bookings"
          subText="Successfully paid bookings"
        />
      </div>

      <div>
        <BookingTable
          data={paginatedBookings}
          loading={isLoading}
          onView={(booking) => {
            router.push(`/dashboard/booking/${booking.id}`);
          }}
          paginationProps={{
            page,
            totalPages,
            onNext: () => setPage((p) => Math.min(p + 1, totalPages)),
            onPrev: () => setPage((p) => Math.max(p - 1, 1)),
          }}
        />
      </div>
    </div>
  );
}
