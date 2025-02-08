// Get transaction fee API using transaction hash
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
  // You can access params directly, no need to await
  const { tx_hash } = await params;

  if (!tx_hash) {
    return NextResponse.json(
      { error: "Transaction hash is required" },
      { status: 400 }
    );
  }
  //Used for testing purpose -> 0x8395927f2e5f97b2a31fd63063d12a51fa73438523305b5b30e7bec6afb26f48

  const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
  const etherscanUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${tx_hash}&apikey=${ETHERSCAN_API_KEY}`;

  try {
    const { data } = await axios.get(etherscanUrl);
    if (!data.result) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Extract gas used and gas price
    const transaction: TransactionData = data.result;
    const gasUsed = parseInt(transaction.gas, 16);
    const gasPrice = parseInt(transaction.gasPrice, 16);
    const feeInEth = (gasUsed * gasPrice) / 1e18;

    // Fetch ETH/USDT price from Binance
    const binanceRes = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT"
    );
    const ethPrice = parseFloat(binanceRes.data.price);
    const feeInUsdt = feeInEth * ethPrice;

    return NextResponse.json({
      tx_hash,
      fee_in_eth: feeInEth,
      fee_in_usdt: feeInUsdt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transaction data" },
      { status: 500 }
    );
  }
}
