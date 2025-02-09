import { test, expect } from "@playwright/test";

test.describe("ETH/USDC Price API", () => {
  const baseURL = "http://localhost:3000/api";

  test("Fetches the latest ETH/USDC price", async ({ request }) => {
    const response = await request.get(`${baseURL}/eth-usdc-price`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();

    expect(responseBody).toHaveProperty("price");
    expect(typeof responseBody.price).toBe("number");
  });
});
