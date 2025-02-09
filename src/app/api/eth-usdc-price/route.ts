// Get ETH/USDT price API
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const binanceRes = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDC"
    );
    const ethPrice = parseFloat(binanceRes.data.price);

    return NextResponse.json({ price: ethPrice });
  } catch (error: any) {
    console.error("Error fetching ETH price:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch ETH price" },
      { status: 500 }
    );
  }
}
