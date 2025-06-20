import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/atoms/card"
import { Separator } from "@/components/atoms/separator"
import { Badge } from "@/components/atoms/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/avatar"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion"
import { getUserRepositories, getUser } from "@/services/githubApi"
import { GitHubUser } from "@/types/github"
import RepositoryCard from "../moleculs/repositoryCard"
import { ChevronDown } from "lucide-react"

// Separate component for each user accordion item
const UserAccordionItem = ({ user }: { user: GitHubUser }) => {
  // Get repositories for this user when accordion is opened
  const { data: repositories = [], isLoading: isLoadingRepos } = useQuery({
    queryKey: ["userRepositories", user.login],
    queryFn: () => getUserRepositories(user.login),
    enabled: false, // Will be enabled when accordion opens
  })

  const { data: userDetails } = useQuery({
    queryKey: ["userDetails", user.login],
    queryFn: () => getUser(user.login),
    enabled: false, // Will be enabled when accordion opens
  })

  return (
    <AccordionItem
      value={user.login}
      className="border rounded-lg overflow-hidden"
    >
      <Card className="border-0">
        <CardContent className="p-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar_url} alt={user.login} />
                <AvatarFallback>
                  {user.login.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-semibold text-gray-900 truncate">
                  {user.name || user.login}
                </h3>
                <p className="text-sm text-gray-500">@{user.login}</p>
                {user.bio && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {user.bio}
                  </p>
                )}
                {/* <div className="flex gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {user.public_repos} repos
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {user.followers} followers
                  </Badge>
                </div> */}
              </div>
            </div>
            <AccordionTrigger className="hover:no-underline p-0"></AccordionTrigger>
          </div>
        </CardContent>
        <AccordionContent className="px-4 pb-4">
          <Separator className="mb-4" />
          {isLoadingRepos ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2 text-sm">
                Loading repositories...
              </p>
            </div>
          ) : repositories.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Repositories</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repositories.map((repo) => (
                  <RepositoryCard key={repo.id} repository={repo} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">
                No public repositories found.
              </p>
            </div>
          )}
        </AccordionContent>
      </Card>
    </AccordionItem>
  )
}

export default UserAccordionItem
