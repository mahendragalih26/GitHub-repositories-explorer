"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/atoms/input"
import { Button } from "@/components/atoms/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card"
// import { Separator } from "@/components/atoms/separator"
import { Badge } from "@/components/atoms/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/avatar"
import { searchUsers, getUserRepositories, getUser } from "@/services/githubApi"
import { GitHubUser } from "@/types/github"
import UserCard from "@/components/moleculs/userCard"
import RepositoryCard from "@/components/moleculs/repositoryCard"
import { Search, ArrowUp } from "lucide-react"

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
  const { data: userDetails } = useQuery({
    queryKey: ["userDetails", selectedUser?.login],
    queryFn: () => getUser(selectedUser!.login),
    enabled: !!selectedUser,
  })

  // Get repositories for selected user
  const { data: repositories = [], isLoading: isLoadingRepos } = useQuery({
    queryKey: ["userRepositories", selectedUser?.login],
    queryFn: () => getUserRepositories(selectedUser!.login),
    enabled: !!selectedUser,
  })

  const handleUserClick = useCallback((user: GitHubUser) => {
    setSelectedUser(user)
  }, [])

  const handleBackToSearch = () => {
    setSelectedUser(null)
  }

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

        {!selectedUser ? (
          // Search Interface
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
                  <UserCard
                    key={user.id}
                    user={user}
                    onClick={handleUserClick}
                  />
                ))}
              </div>
            )}

            {searchQuery && !isSearching && users.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  No users found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        ) : (
          // User Details and Repositories
          <div>
            <div className="mb-6">
              <Button
                onClick={handleBackToSearch}
                variant="outline"
                className="mb-4"
              >
                <ArrowUp className="w-4 h-4 mr-2 rotate-[-90deg]" />
                Back to Search
              </Button>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={selectedUser.avatar_url}
                        alt={selectedUser.login}
                      />
                      <AvatarFallback className="text-2xl">
                        {selectedUser.login.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {userDetails?.name || selectedUser.login}
                      </h1>
                      <p className="text-lg text-gray-600 mb-2">
                        @{selectedUser.login}
                      </p>
                      {userDetails?.bio && (
                        <p className="text-gray-700 mb-4">{userDetails.bio}</p>
                      )}
                      <div className="flex gap-4">
                        <Badge variant="secondary" className="text-sm">
                          {userDetails?.public_repos ||
                            selectedUser.public_repos}{" "}
                          repositories
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {userDetails?.followers || selectedUser.followers}{" "}
                          followers
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {userDetails?.following || selectedUser.following}{" "}
                          following
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Repositories</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRepos ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">
                      Loading repositories...
                    </p>
                  </div>
                ) : repositories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repositories.map((repo) => (
                      <RepositoryCard key={repo.id} repository={repo} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">
                      No public repositories found.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default GitHubSearch
