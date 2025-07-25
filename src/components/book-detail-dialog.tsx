import { useState } from "react";
import type { Book } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, LoaderCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import useBookBlob from "@/hooks/useBookBlob";
import { toast } from "sonner";

interface BookDetailDialogProps {
  book: Book | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailDialog({ book, open, onOpenChange }: BookDetailDialogProps) {

  
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    data: blobData,
    isLoading: blobLoading,
    error: blobError,
    refetch: refetchBlob
  } = useBookBlob(book?.file || null);

  const handleDownload = async() => {
    try{
      setIsDownloading(true);

      if(!blobData?.blobUrl){
        if(blobError) {
          toast.error('Failed to load book data', {
            description: blobError.message || 'Could not prepare the book for download'
          });
          return;
        }
        if(blobLoading) {
          toast.info('Please wait', {
            description: 'Book is still loading...'
          });
          return;
        }
        
        await refetchBlob();
        if(!blobData?.blobUrl){
          throw new Error('Failed to load book data');
        }
      }

      const url = blobData?.blobUrl;
      const fileName = `${book?.title.replace(/[^\w\s]/gi, '_').replace(/\s+/g,'_')}.pdf`;
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
  
      setTimeout(() => {
        document.body.removeChild(link);
        toast.success('Download started', {
          description: `${book?.title} is being downloaded`
        });
      }, 500);


    } catch(error){
      toast.error('Downolad failed',{
        description: error instanceof Error ? error.message : 'Failed to downlod the book'
      });
    } finally {
      setIsDownloading(false);
    }
  }
  
  if (!book) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold">{book.title}</DialogTitle>
          </div>
          <DialogDescription className="flex items-center gap-4">
            <div className="flex items-center text-muted-foreground text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {format(parseISO(book.createdAt), "MMM d, yyyy")}
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col  gap-6 py-4 overflow-auto">
          <div className="flex sm:grid-cols-[220px_1fr] gap-6">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-1/3 aspect-[3/4] object-cover rounded-md shadow-md"
            />
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Author</h3>
                <p className="text-sm/relaxed text-muted-foreground mt-2">
                  {book.author.name}
                </p>
              </div>
              <Badge variant="outline">{book.genre}</Badge>
            </div>
          </div>
          <div className="w-full mt-4">
            <h3 className="font-medium text-lg">About this book</h3>
            <p className="text-sm/relaxed text-muted-foreground mt-2">
              {book.description}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleDownload}
            className="gap-2"
            disabled={isDownloading}
          >
            {isDownloading ? 
            <LoaderCircle className="animate-spin"/>
              : <Download className="h-4 w-4" /> }
            Download PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}