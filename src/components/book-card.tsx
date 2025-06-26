import type { Book } from "@/types/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookCardProps {
  book: Book
  onClick: () => void
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <Card
      className="group p-0 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-0 shadow-sm"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={book.coverImage || "/placeholder.svg"}
            alt={`Cover of ${book.title}`}
            width={280}
            height={400}
            className="w-full h-[240px] object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <div className="pt-1">
            <Badge variant="outline" className="text-xs">
              {book.genre}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}