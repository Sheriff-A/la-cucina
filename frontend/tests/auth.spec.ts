// Sign-in and access, end to end against the Neon development branch (ADR-0009, ADR-0010).
// The seeded users' credentials come from .env.seed.local (loaded in playwright.config.ts);
// tests that need them are skipped when it's missing, e.g. in CI.

import { expect, test, type Page } from "@playwright/test";

interface SeededUser {
  label: string;
  email?: string;
  password?: string;
}

const seeded = (key: string): SeededUser => ({
  label: key.toLowerCase().replace(/_/g, " "),
  email: process.env[`SEED_${key}_EMAIL`],
  password: process.env[`SEED_${key}_PASSWORD`],
});

const admins = [seeded("ADMIN_1"), seeded("ADMIN_2")];
const readers = [seeded("READER_1"), seeded("READER_2")];

// Neon Auth's session cookies are Secure. Playwright's WebKit stores them on
// http://localhost but never sends them back, so signed-in tests can't run there locally.
const WEBKIT_SECURE_COOKIES =
  "Playwright WebKit doesn't send Secure cookies over http://localhost";

async function signIn(page: Page, user: SeededUser, next = "/admin") {
  await page.goto(`/sign-in?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Email").fill(user.email!);
  await page.getByLabel("Password").fill(user.password!);
  await page.getByRole("button", { name: "Sign in" }).click();
}

test.describe("signed-out visitors", () => {
  test("are sent from the admin to sign-in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(
      /\/sign-in\?next=%2Fadmin|\/sign-in\?next=\/admin/,
    );
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
  });

  test("see an error for a wrong password", async ({ page }) => {
    await signIn(page, {
      label: "nobody",
      email: "nobody@example.com",
      password: "not-the-password",
    });
    await expect(
      page.getByText("That email and password don't match."),
    ).toBeVisible();
  });
});

test.describe("closed sign-up", () => {
  test("the sign-up page shows a toast and sends nothing", async ({ page }) => {
    const authRequests: string[] = [];
    page.on("request", (request) => {
      if (new URL(request.url()).pathname.startsWith("/api/auth"))
        authRequests.push(request.url());
    });
    await page.goto("/sign-up");
    await page.getByLabel("Name").fill("Someone New");
    await page.getByLabel("Email").fill("someone-new@example.com");
    await page.getByLabel("Password").fill("a-password-123");
    await page.getByRole("button", { name: "Sign up" }).click();
    await expect(page.getByText("Sign up coming soon")).toBeVisible();
    expect(authRequests).toEqual([]);
  });

  test("the auth route rejects sign-up before Neon Auth", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/sign-up/email", {
      data: {
        email: "someone-new@example.com",
        password: "a-password-123",
        name: "Someone New",
      },
    });
    expect(response.status()).toBe(403);
    expect(await response.json()).toMatchObject({ code: "SIGN_UP_DISABLED" });
  });
});

for (const admin of admins) {
  test(`${admin.label} signs in, reaches the admin and signs out`, async ({
    page,
    browserName,
  }) => {
    test.skip(!admin.email || !admin.password, "no seeded credentials");
    test.skip(browserName === "webkit", WEBKIT_SECURE_COOKIES);
    await signIn(page, admin);
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
    await expect(page.getByText(/^Signed in as .+\.$/)).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/sign-in/);
  });
}

for (const reader of readers) {
  test(`${reader.label} signs in and is refused the admin`, async ({
    page,
    browserName,
  }) => {
    test.skip(!reader.email || !reader.password, "no seeded credentials");
    test.skip(browserName === "webkit", WEBKIT_SECURE_COOKIES);
    await signIn(page, reader, "/");
    await expect(page).toHaveURL(/\/$/);

    const response = await page.goto("/admin");
    expect(response?.status()).toBe(403);
    await expect(
      page.getByRole("heading", { name: "Not allowed" }),
    ).toBeVisible();
    await expect(page.getByText(/Signed in as/)).toHaveCount(0);
  });
}
