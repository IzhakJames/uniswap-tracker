import { test, expect } from "@playwright/test";

test.describe("Fetch Historical Transactions", () => {
  const baseURL = "http://localhost:3000/api";

  test("Fetches transactions successfully with dates", async ({ request }) => {
    const response = await request.get(
      `${baseURL}/transactions?start_time=2024-02-01&end_time=2024-02-10`
    );

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);
    expect(responseBody[0]).toHaveProperty("tx_hash");
    expect(responseBody[0]).toHaveProperty("fee_in_eth");
    expect(responseBody[0]).toHaveProperty("fee_in_usdt");
  });

  test("Returns error when start_time or end_time is missing", async ({
    request,
  }) => {
    const response = await request.get(
      `${baseURL}/transactions?start_time=2024-02-01`
    );

    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty(
      "error",
      "start_time and end_time are required as query parameters"
    );
  });
});
