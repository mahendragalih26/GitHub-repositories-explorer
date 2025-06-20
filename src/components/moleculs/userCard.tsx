import { GitHubUser } from "@/types/github"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/atoms/avatar"

interface UserCardProps {
  user: GitHubUser
}

const UserCard = ({ user }: UserCardProps) => {
  return (
    <div className="cursor-pointer flex items-center space-x-4">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.avatar_url} alt={user.login} />
        <AvatarFallback>{user.login.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">
          {user.name || user.login}
        </h3>
        <p className="text-sm text-gray-500">@{user.login}</p>
        {user.bio && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{user.bio}</p>
        )}
        {/* <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {user.public_repos ?? 0} repos
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {user?.followers ?? 0} followers
                </Badge>
              </div> */}
      </div>
    </div>
  )
}

export default UserCard
