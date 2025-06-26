import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useBookBlob from '@/hooks/useBookBlob';
import { useBooks } from '@/hooks/useBooks';
import { ChevronLeft, ChevronRight, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ReadBook() {

  const navigate = useNavigate();

  const [ searchParams ] = useSearchParams();
  const bookId = searchParams.get('b');

  const {books, isLoading}= useBooks();
  const book = books?.find(b => b._id === bookId);

  const {
    data: bookBlobData,
    isLoading: blobLoading,
    error: blobError
  } = useBookBlob(book?.file || null);

  const [showDetails, setShowDetails] = useState(true)

  useEffect(()=>{
    if(blobError){
      toast.error('Failed to load pdf', {
        description: 'Could not load the book file'
      });
    }
  },[blobError])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-85px)]">
        <div className="text-center">
          <LoaderCircle className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!bookId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-85px)]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No Book Selected</h1>
          <p className="text-muted-foreground mb-4">Please select a book to read.</p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-85px)]">
      {/* Left side - Book details */}
      <div
        className={`bg-muted/30 p-6 overflow-y-auto transition-all duration-300 ${
          showDetails ? "w-1/3" : "w-0 p-0 overflow-hidden"
        }`}
      >
        {showDetails && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold">{book?.title}</h2>
            </div>

            <div className="flex justify-center">
              <img
                src={book?.coverImage || "/placeholder.svg"}
                alt={`Cover of ${book?.title}`}
                width={200}
                height={300}
                className="object-cover rounded-md shadow-md"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Author</h3>
                <p>{book?.author.name}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Genre</h3>
                <Badge variant="outline">{book?.genre}</Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Year</h3>
                <p>
                  {book?.createdAt 
                    ? new Date(book?.createdAt).getFullYear() || 'Unknown'
                    : 'Unknown'
                  }</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground">{book?.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right side - PDF viewer */}
      <div className={`relative ${showDetails ? "w-2/3" : "w-full"}`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 z-10 bg-background/80 hover:bg-background"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        <div className="h-full">
          {blobLoading 
            ? <div className="flex items-center justify-center h-[calc(100vh-85px)]">
                <div className="text-center">
                  <LoaderCircle className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading book...</p>
                </div>
              </div>
            : <iframe src ={`${bookBlobData?.blobUrl}#page=0&toolbar=0`} className='h-full w-full'/>
          }
        </div>
      </div>
    </div>
  )
}