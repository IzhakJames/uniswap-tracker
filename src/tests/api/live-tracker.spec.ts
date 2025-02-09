import { test, expect } from "@playwright/test";

test.describe("Live Transaction Tracker API", () => {
  const baseURL = "http://localhost:3000/api";

  test("Starts live tracking successfully", async ({ request }) => {
    const response = await request.get(`${baseURL}/live-tracker/start`);

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("message", "Live tracking started");
  });
});
