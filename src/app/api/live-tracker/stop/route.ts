import { NextResponse } from "next/server";
import Web3 from "web3";
import { web3 } from "../start/route";

// Access the same Web3 instance used in `/start`
const subscription = web3.eth.subscribe("pendingTransactions");

export async function GET() {
  try {
    if (!subscription) {
      return NextResponse.json(
        { message: "No active live tracking to stop" },
        { status: 400 }
      );
    }

    await (await subscription).unsubscribe();
    console.log("🛑 Live tracking stopped.");

    return NextResponse.json({ message: "Live tracking stopped" });
  } catch (error: any) {
    console.error("Error stopping live tracker:", error.message);
    return NextResponse.json(
      { error: "Failed to stop live tracker" },
      { status: 500 }
    );
  }
}
