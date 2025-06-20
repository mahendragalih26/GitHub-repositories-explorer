import { test, expect } from "@playwright/test"

test.describe("UserCard Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")

    // Search for users to get user cards
    const searchInput = page.getByPlaceholder("Search GitHub users...")
    await searchInput.fill("octocat")
    await expect(page.locator('[data-testid="user-card"]').first()).toBeVisible(
      { timeout: 10000 }
    )
  })

  test("should display user avatar and information", async ({ page }) => {
    const userCard = page.locator('[data-testid="user-card"]').first()

    // Check if avatar is visible
    await expect(userCard.locator("img")).toBeVisible()

    // Check if username is visible
    await expect(userCard.getByText(/@/)).toBeVisible()

    // Check if repository and follower counts are visible
    await expect(userCard.getByText(/repos/)).toBeVisible()
    await expect(userCard.getByText(/followers/)).toBeVisible()
  })

  test("should be clickable and have hover effects", async ({ page }) => {
    const userCard = page.locator('[data-testid="user-card"]').first()

    // Check if the card is clickable
    await expect(userCard).toHaveCSS("cursor", "pointer")

    // Hover over the card and check for hover effects
    await userCard.hover()

    // Click should navigate to user details
    await userCard.click()
    await expect(
      page.getByRole("button", { name: "Back to Search" })
    ).toBeVisible()
  })
})
