import {
  GitHubUser,
  GitHubRepository,
  SearchUsersResponse,
} from "@/types/github"

const GITHUB_API_BASE = "https://api.github.com"
// const GITHUB_API_BASE = process.env.GITHUB_API_BASE;

export const searchUsers = async (query: string): Promise<GitHubUser[]> => {
  if (!query.trim()) return []

  const response = await fetch(
    `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(query)}&per_page=5`
  )

  if (!response.ok) {
    throw new Error("Failed to search users")
  }

  const data: SearchUsersResponse = await response.json()
  return data.items
}

export const getUserRepositories = async (
  username: string
): Promise<GitHubRepository[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch repositories")
  }

  return response.json()
}

export const getUser = async (username: string): Promise<GitHubUser> => {
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`)

  if (!response.ok) {
    throw new Error("Failed to fetch user details")
  }

  return response.json()
}
