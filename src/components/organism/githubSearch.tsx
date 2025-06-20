"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/atoms/input"
import { Card, CardContent } from "@/components/atoms/card"
// import { Separator } from "@/components/atoms/separator"
import { searchUsers, getUserRepositories, getUser } from "@/services/githubApi"
import { GitHubUser } from "@/types/github"
import { Search } from "lucide-react"
import { Accordion } from "@/components/atoms/accordion"
import UserAccordionItem from "./accordionCard"

const GitHubSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<GitHubUser | null>(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Search users query
  const { data: users = [], isLoading: isSearching } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  })

  // Get selected user details
  const {} = useQuery({
    queryKey: ["userDetails", selectedUser?.login],
    queryFn: () => getUser(selectedUser!.login),
    enabled: !!selectedUser,
  })

  // Get repositories for selected user
  const {} = useQuery({
    queryKey: ["userRepositories", selectedUser?.login],
    queryFn: () => getUserRepositories(selectedUser!.login),
    enabled: !!selectedUser,
  })

  const handleUserClick = useCallback((user: GitHubUser) => {
    setSelectedUser(user)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GitHub User Explorer
          </h1>
          <p className="text-lg text-gray-600">
            Search for GitHub users and explore their repositories
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search GitHub users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {isSearching && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Searching users...</p>
            </div>
          )}

          {users.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Found {users.length} user{users.length !== 1 ? "s" : ""}
              </h2>
              {users.map((user) => (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                  key={user.id}
                >
                  {/* <UserCard
                      key={user.id}
                      user={user}
                      onClick={handleUserClick}
                    /> */}
                  <UserAccordionItem
                    key={user.id}
                    user={user}
                    onClick={handleUserClick}
                  />
                </Accordion>
              ))}
            </div>
          )}

          {searchQuery && !isSearching && users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No users found for &quot;{searchQuery}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GitHubSearch
