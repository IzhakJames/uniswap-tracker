"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Props {
  filters: { txId: string; startTime: string; endTime: string };
}

interface Transaction {
  tx_hash: string;
  fee_in_eth: number;
  fee_in_usdt: number;
}

export default function TransactionTable({ filters }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/transactions`, {
          params: {
            start_time: filters.startTime,
            end_time: filters.endTime,
            page,
            pageSize,
          },
        });
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [filters]);

  // ✅ Calculate Pagination
  const totalPages = Math.ceil(transactions.length / pageSize);
  const paginatedTransactions = transactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-2">Transactions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Tx Hash</th>
                <th className="p-2 text-left">Fee (ETH)</th>
                <th className="p-2 text-left">Fee (USDT)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((txn) => (
                <tr key={txn.tx_hash} className="border-b">
                  <td className="p-2">{txn.tx_hash}</td>
                  <td className="p-2">{txn.fee_in_eth.toFixed(6)} ETH</td>
                  <td className="p-2">{txn.fee_in_usdt.toFixed(2)} USDT</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="bg-gray-500 text-white p-2 rounded"
            >
              Next
            </button>

            {/* ✅ Page Size Dropdown */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1); // Reset to first page
              }}
              className="border p-2 rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </>
      )}
    </div>
  );
}
