import { NextResponse } from "next/server";
import Web3 from "web3";
import axios from "axios";

const INFURA_WS_URL = process.env.INFURA_WS_URL; // Infura WebSocket URL
const UNISWAP_POOL_ADDRESS = "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640"; // Uniswap V3 USDC/ETH Pool

if (!INFURA_WS_URL) {
  throw new Error("Missing INFURA_WS_URL in environment variables");
}

export const web3 = new Web3(
  new Web3.providers.WebsocketProvider(INFURA_WS_URL)
);

export async function GET() {
  try {
    console.log("Listening for real-time Uniswap transactions...");

    web3.eth.subscribe(
      "pendingTransactions",
      async (error: Error | null, txHash: string | undefined) => {
        if (error) {
          console.error("Subscription error:", error);
          return;
        }

        if (!txHash) {
          console.warn("Received undefined txHash, skipping...");
          return;
        }

        try {
          const tx = await web3.eth.getTransaction(txHash);
          console.log("tx", tx);
          if (
            !tx ||
            tx.to?.toLowerCase() !== UNISWAP_POOL_ADDRESS.toLowerCase()
          ) {
            return;
          }

          const receipt = await web3.eth.getTransactionReceipt(txHash);
          if (!receipt) return;

          const gasUsed = BigInt(receipt.gasUsed);
          const gasPrice = BigInt(tx.gasPrice || "0");

          // ✅ Fix BigInt multiplication issue
          const feeInWei = gasUsed * gasPrice; // BigInt * BigInt
          const feeInEth = Number(feeInWei) / 1e18; // Convert BigInt to number

          // Fetch ETH/USDT price from Binance
          const binanceRes = await axios.get(
            "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDC"
          );
          const ethPrice = parseFloat(binanceRes.data.price);
          const feeInUsdt = feeInEth * ethPrice;

          console.log(`🚀 New Transaction: ${txHash}`);
          console.log(`💰 Fee: ${feeInEth} ETH (${feeInUsdt} USDC)`);
        } catch (error) {
          console.error("Transaction processing error:", error);
        }
      }
    );

    return NextResponse.json({ message: "Live tracking started" });
  } catch (error: any) {
    console.error("Live tracker error:", error.message);
    return NextResponse.json(
      { error: "Failed to start live tracker" },
      { status: 500 }
    );
  }
}
