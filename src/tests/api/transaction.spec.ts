import { test, expect } from "@playwright/test";

test.describe("Transaction Fee API", () => {
  const baseURL = "http://localhost:3000/api";

  test("Fetches transaction fee successfully", async ({ request }) => {
    const txHash =
      "0x8395927f2e5f97b2a31fd63063d12a51fa73438523305b5b30e7bec6afb26f48"; // Replace with a real hash for testing
    const response = await request.get(`${baseURL}/transaction/${txHash}`);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("tx_hash", txHash);
    expect(responseBody).toHaveProperty("fee_in_eth");
    expect(responseBody).toHaveProperty("fee_in_usdt");
  });

  test("Returns error for invalid hash", async ({ request }) => {
    const response = await request.get(`${baseURL}/transaction/invalid_hash`);

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("error");
  });
});
