import { GitHubUser } from "@/types/github"
import { Card, CardContent } from "@/components/atoms/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/avatar"
import { Badge } from "@/components/atoms/badge"

interface UserCardProps {
  user: GitHubUser
  onClick: (user: GitHubUser) => void
}

const UserCard = ({ user, onClick }: UserCardProps) => {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-gray-200 hover:border-blue-300"
      onClick={() => onClick(user)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback>
              {user.login.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.name || user.login}
            </h3>
            <p className="text-sm text-gray-500">@{user.login}</p>
            {user.bio && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {user.bio}
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {user.public_repos} repos
              </Badge>
              <Badge variant="outline" className="text-xs">
                {user.followers} followers
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default UserCard
