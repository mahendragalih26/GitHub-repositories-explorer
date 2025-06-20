import { test, expect } from "@playwright/test"

test.describe("GitHub User Explorer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("should display the main heading and search input", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "GitHub User Explorer" })
    ).toBeVisible()
    await expect(page.getByPlaceholder("Search GitHub users...")).toBeVisible()
  })

  test("should search for users and display results", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search GitHub users...")

    // Type a search query
    await searchInput.fill("octocat")

    // Wait for search results to appear
    await expect(page.getByText("Found")).toBeVisible({ timeout: 10000 })

    // Check if user cards are displayed
    await expect(
      page.locator('[data-testid="user-card"]').first()
    ).toBeVisible()
  })

  test("should show user details when clicking on a user", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search GitHub users...")

    // Search for a user
    await searchInput.fill("octocat")

    // Wait for results and click on the first user
    await expect(page.locator('[data-testid="user-card"]').first()).toBeVisible(
      { timeout: 10000 }
    )
    await page.locator('[data-testid="user-card"]').first().click()

    // Check if we're now on the user details page
    await expect(
      page.getByRole("button", { name: "Back to Search" })
    ).toBeVisible()
    await expect(page.getByText("All Repositories")).toBeVisible()
  })

  test("should display highlighted repositories accordion", async ({
    page,
  }) => {
    const searchInput = page.getByPlaceholder("Search GitHub users...")

    // Search for a user with repositories
    await searchInput.fill("octocat")

    // Wait for results and click on the first user
    await expect(page.locator('[data-testid="user-card"]').first()).toBeVisible(
      { timeout: 10000 }
    )
    await page.locator('[data-testid="user-card"]').first().click()

    // Check if highlighted repositories section exists
    await expect(page.getByText("Highlighted Repositories")).toBeVisible()
  })

  test("should navigate back to search from user details", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search GitHub users...")

    // Search and select a user
    await searchInput.fill("octocat")
    await expect(page.locator('[data-testid="user-card"]').first()).toBeVisible(
      { timeout: 10000 }
    )
    await page.locator('[data-testid="user-card"]').first().click()

    // Click back button
    await page.getByRole("button", { name: "Back to Search" }).click()

    // Should be back on search page
    await expect(page.getByPlaceholder("Search GitHub users...")).toBeVisible()
    await expect(page.getByText("Found")).toBeVisible()
  })

  test("should display loading states", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search GitHub users...")

    // Start typing and check for loading state
    await searchInput.fill("test")

    // Should show loading indicator
    await expect(page.getByText("Searching users...")).toBeVisible()
  })

  test("should handle no results found", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search GitHub users...")

    // Search for something that likely won't have results
    await searchInput.fill(
      "thisisaverylongusernamethatprobablydoesnotexist123456789"
    )

    // Wait a moment for the search to complete
    await page.waitForTimeout(2000)

    // Should show no results message
    await expect(page.getByText(/No users found for/)).toBeVisible()
  })
})
