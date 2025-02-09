import { NextResponse } from "next/server";
import axios from "axios";

interface Transaction {
  hash: string;
  gasUsed: string;
  gasPrice: string;
  timeStamp: string;
}

function convertDateToTimestamp(dateString: string | null): number | null {
  if (!dateString) return null;
  return Math.floor(new Date(dateString).getTime() / 1000);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let start_time = searchParams.get("start_time");
    let end_time = searchParams.get("end_time");

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "start_time and end_time are required as query parameters" },
        { status: 400 }
      );
    }

    // Convert date strings to timestamps if needed
    if (isNaN(Number(start_time)))
      start_time = String(convertDateToTimestamp(start_time));
    if (isNaN(Number(end_time)))
      end_time = String(convertDateToTimestamp(end_time));

    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
    if (!ETHERSCAN_API_KEY) {
      return NextResponse.json(
        { error: "Missing ETHERSCAN_API_KEY in environment variables" },
        { status: 500 }
      );
    }

    // Fetch historical transactions from Etherscan
    const UNISWAP_POOL_ADDRESS = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"; // Uniswap V3 USDC/ETH Pool
    const etherscanUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${UNISWAP_POOL_ADDRESS}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

    const { data } = await axios.get(etherscanUrl);
    if (data.message !== "OK" || !data.result) {
      return NextResponse.json(
        { error: "Failed to fetch transactions from Etherscan" },
        { status: 500 }
      );
    }

    // Filter transactions within the given time range
    const filteredTransactions: Transaction[] = data.result.filter(
      (txn: Transaction) =>
        parseInt(txn.timeStamp) >= parseInt(start_time) &&
        parseInt(txn.timeStamp) <= parseInt(end_time)
    );

    if (filteredTransactions.length === 0) {
      return NextResponse.json(
        { message: "No transactions found in the given time range" },
        { status: 404 }
      );
    }

    // Fetch ETH/USDT price from Binance
    const binanceRes = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
    );
    const ethPrice = parseFloat(binanceRes.data.price);

    // Compute fees in USDT
    const transactionsWithFees = filteredTransactions.map((txn) => {
      const gasUsed = parseInt(txn.gasUsed, 16);
      const gasPrice = parseInt(txn.gasPrice, 16);
      const feeInEth = (gasUsed * gasPrice) / 1e18;
      const feeInUsdt = feeInEth * ethPrice;

      return {
        tx_hash: txn.hash,
        timestamp: txn.timeStamp,
        fee_in_eth: feeInEth,
        fee_in_usdt: feeInUsdt,
      };
    });

    return NextResponse.json(transactionsWithFees);
  } catch (error: any) {
    console.error("Error fetching transactions:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
