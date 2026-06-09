"use client";

import React, { useState } from "react";

import {
  ScanLine,
  X,
  Activity,
} from "lucide-react";

import TicketScanner from "@/components/common/TicketScanner";
import ScanLogTable from "@/components/table/ScanLogTable";
import { useScanLogs } from "@/lib/queries/useScanLogs";
import StatCard from "@/components/common/StatCard";
import Button from "@/components/ui/Button";

export default function Page() {

  const [openScanner, setOpenScanner] =
    useState(false);

  const {
    data: scanLogs,
    isLoading,
  } = useScanLogs();

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* 🔥 HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">

        {/* LEFT */}
        <div>
          <div className="flex items-center gap-3">

            

            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Ticket Scanner
              </h1>

              <p className="text-slate-500 mt-1">
                Monitor and manage ticket scan activity
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 RIGHT BUTTON */}
        <Button
        text="Scan Ticket"
        icon={ScanLine}
        iconPosition="left"
          onClick={() => setOpenScanner(true)}
          className=" px-6 rounded-2xl font-bold text-white flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] transition-all"
          
        >
          <ScanLine size={20} />

          Scan Ticket
        </Button>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

        <StatCard
          title="Total Scans"
          value={scanLogs?.length || 0}
          percentage={12}
          isUp={true}
          trendingText="Live ticket scans"
          subText="Total scanned tickets"
        />

        <StatCard
          title="Entry Scans"
          value={
            scanLogs?.filter(
              (log) => log.type === "ENTRY"
            )?.length || 0
          }
          percentage={8}
          isUp={true}
          trendingText="Entry activity"
          subText="Visitors entered"
        />

        <StatCard
          title="Scanned Today"
          value={
            scanLogs?.filter((log) => {

              const today =
                new Date().toDateString();

              return (
                new Date(log.scannedAt)
                  .toDateString() === today
              );
            })?.length || 0
          }
          percentage={15}
          isUp={true}
          trendingText="Today's scans"
          subText="Daily scan activity"
        />
      </div>

      {/* 🔥 TABLE CARD */}
      <div >

        <ScanLogTable
          data={scanLogs || []}
          loading={isLoading}
        />
      </div>

      {/* 🔥 MODAL */}
      {openScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

          <div className="relative w-full max-w-2xl rounded-[2rem] bg-white shadow-2xl overflow-hidden">

            {/* TOP BAR */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Scan Ticket
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Place QR code inside the scanner
                </p>
              </div>

              <button
                onClick={() =>
                  setOpenScanner(false)
                }
                className="h-11 w-11 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all"
              >
                <X size={22} />
              </button>
            </div>

            {/* SCANNER */}
            <div className="p-6">
              <TicketScanner />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}