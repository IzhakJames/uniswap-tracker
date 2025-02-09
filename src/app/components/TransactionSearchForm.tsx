"use client";
import { useState } from "react";

interface Props {
  onSearch: (filters: {
    txId: string;
    startTime: string;
    endTime: string;
  }) => void;
}

// ✅ Function to get today's date in `YYYY-MM-DD` format
const getToday = () => new Date().toISOString().split("T")[0];

export default function TransactionSearchForm({ onSearch }: Props) {
  const [txId, setTxId] = useState("");
  const [startTime, setStartTime] = useState(getToday()); // ✅ Default: today
  const [endTime, setEndTime] = useState(getToday()); // ✅ Default: today

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ txId, startTime, endTime });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-200 p-4 rounded-lg mb-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={txId}
          onChange={(e) => setTxId(e.target.value)}
          placeholder="Transaction ID"
          className="p-2 border rounded w-full"
        />
        <input
          type="date"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Search
        </button>
      </div>
    </form>
  );
}
