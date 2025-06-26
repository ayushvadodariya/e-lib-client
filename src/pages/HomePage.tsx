import BookCard from "@/components/book-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import { useBooks } from "@/hooks/useBooks";
import type { Book } from "@/types/types";
import { useNavigate } from "react-router-dom";

function HomePage() {

  const { books, isLoading } = useBooks();
  const navigate = useNavigate();

  const handleBookClick = (book: Book) => {
    navigate(`${ROUTES.APP.READ}?b=${book._id}`);
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {books?.map((book) => (
          <BookCard key={book._id} book={book} onClick={() => handleBookClick(book)}/>
        ))}
      </div>

      {/* Loading skeletons */}
      { isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mt-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-[240px] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage