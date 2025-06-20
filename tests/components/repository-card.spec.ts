import { test, expect } from "@playwright/test"

test.describe("RepositoryCard Component", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")

    // Navigate to a user's repositories
    const searchInput = page.getByPlaceholder("Search GitHub users...")
    await searchInput.fill("octocat")
    await expect(page.locator('[data-testid="user-card"]').first()).toBeVisible(
      { timeout: 10000 }
    )
    await page.locator('[data-testid="user-card"]').first().click()

    // Wait for repositories to load
    await expect(page.getByText("All Repositories")).toBeVisible()
  })

  test("should display repository information", async ({ page }) => {
    const repoCard = page.locator('[data-testid="repository-card"]').first()

    // Wait for repository cards to be visible
    await expect(repoCard).toBeVisible({ timeout: 10000 })

    // Check if repository name is a link
    await expect(repoCard.locator("a").first()).toBeVisible()

    // Check if stats are visible (stars, forks)
    await expect(repoCard.getByText(/⭐/)).toBeVisible()
    await expect(repoCard.getByText(/🍴/)).toBeVisible()

    // Check if "View" button is visible
    await expect(repoCard.getByRole("link", { name: "View" })).toBeVisible()
  })

  test("should have working external links", async ({ page }) => {
    const repoCard = page.locator('[data-testid="repository-card"]').first()
    await expect(repoCard).toBeVisible({ timeout: 10000 })

    // Check if the repository name link has target="_blank"
    const repoLink = repoCard.locator("a").first()
    await expect(repoLink).toHaveAttribute("target", "_blank")

    // Check if the "View" button has target="_blank"
    const viewButton = repoCard.getByRole("link", { name: "View" })
    await expect(viewButton).toHaveAttribute("target", "_blank")
  })
})
