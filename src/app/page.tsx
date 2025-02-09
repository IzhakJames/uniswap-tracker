"use client";
import { useState } from "react";
import TransactionSearchForm from "@/app/components/TransactionSearchForm";
import TransactionTable from "@/app/components/TransactionTable";
import TransactionSummary from "@/app/components/TransactionSummary";

export default function Home() {
  const [filters, setFilters] = useState({
    txId: "",
    startTime: "",
    endTime: "",
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crypto Transaction Tracker</h1>
      <TransactionSearchForm onSearch={setFilters} />
      {/* <TransactionSummary filters={filters} /> */}
      <TransactionTable filters={filters} />
    </div>
  );
}
