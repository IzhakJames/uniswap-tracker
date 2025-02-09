import { NextResponse } from "next/server";
import axios from "axios";

interface TransactionData {
  gas: string;
  gasPrice: string;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tx_hash: string }> }
) {
  const { tx_hash } = await params;

  if (!tx_hash) {
    return NextResponse.json(
      { error: "Transaction hash is required" },
      { status: 400 }
    );
  }

  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
  if (!ETHERSCAN_API_KEY) {
    return NextResponse.json(
      { error: "Missing ETHERSCAN_API_KEY in environment variables" },
      { status: 500 }
    );
  }

  const etherscanUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${tx_hash}&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const { data } = await axios.get(etherscanUrl);

    if (data.message === "NOTOK") {
      return NextResponse.json({ error: data.result }, { status: 403 });
    }

    // Check if transaction exists
    if (!data.result) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 400 }
      );
    }

    // Extract gas used and gas price
    const transaction: TransactionData = data.result;
    const gasUsed = parseInt(transaction.gas, 16);
    const gasPrice = parseInt(transaction.gasPrice, 16);
    const feeInEth = (gasUsed * gasPrice) / 1e18;

    // Fetch ETH/USDT price from Binance
    const BINANCE_API_URL = process.env.BINANCE_API_URL;
    const binanceRes = await axios.get(
      `${BINANCE_API_URL}/price?symbol=ETHUSDT`
    );
    const ethPrice = parseFloat(binanceRes.data.price);
    const feeInUsdt = feeInEth * ethPrice;

    return NextResponse.json({
      tx_hash,
      fee_in_eth: feeInEth,
      fee_in_usdt: feeInUsdt,
    });
  } catch (error: any) {
    console.error("Etherscan API Error:", error.message);

    return NextResponse.json(
      { error: "Failed to fetch transaction data" },
      { status: 500 }
    );
  }
}
