import { GitHubRepository } from "@/types/github"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card"
import { Badge } from "@/components/atoms/badge"
import { Button } from "@/components/atoms/button"
import { Github } from "lucide-react"

interface RepositoryCardProps {
  repository: GitHubRepository
}

const RepositoryCard = ({ repository }: RepositoryCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getLanguageColor = (language: string | null) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-600",
      Python: "bg-green-600",
      Java: "bg-red-600",
      "C++": "bg-blue-800",
      "C#": "bg-purple-600",
      Ruby: "bg-red-700",
      Go: "bg-cyan-600",
      Rust: "bg-orange-700",
      PHP: "bg-indigo-600",
      Swift: "bg-orange-500",
      Kotlin: "bg-purple-700",
    }
    return colors[language || ""] || "bg-gray-500"
  }

  return (
    <Card
      className="h-full hover:shadow-md transition-shadow duration-200"
      data-testid="repository-card"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {repository.name}
            </a>
          </CardTitle>
          {repository.private && (
            <Badge variant="secondary" className="text-xs">
              Private
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {repository.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {repository.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            {repository.language && (
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${getLanguageColor(
                    repository.language
                  )}`}
                />
                <span>{repository.language}</span>
              </div>
            )}
            <span>⭐ {repository.stargazers_count}</span>
            <span>🍴 {repository.forks_count}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            Updated {formatDate(repository.updated_at)}
          </span>
          <Button variant="outline" size="sm" asChild className="h-8">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-3 h-3 mr-1" />
              View
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default RepositoryCard
