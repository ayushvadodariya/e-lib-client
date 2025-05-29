import { getBooks } from "@/http/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast, Toaster } from "sonner"
import { CirclePlus } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Book } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, LoaderCircle } from "lucide-react"
import { useEffect } from "react"
import useBreadcrumbStore, { type BreadcrumbItemType} from "@/store/breadcrumbStore"
import { Link } from "react-router-dom";

function BooksPage() {

  const queryClient = useQueryClient();
  const { setItem } = useBreadcrumbStore((state)=>state);

  const {data, error, isLoading, isError} = useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await getBooks();
      return response.data;
    },
    staleTime: 10000,
  });

  
  useEffect(()=>{

    const breadCrumbItems:BreadcrumbItemType[] = [
      {
        label: 'Home',
        path: '/dashboard/home'
      },
      {
        label: 'Books',
        path: '/dashboard/home/books'
      }
    ]
    setItem(breadCrumbItems);

    if(isError && error) {
      toast.error('Failed to load books', {
        description: error.message,
        action: {
          label: 'Retry',
          onClick: () => queryClient.invalidateQueries({ queryKey: ['books']})
        }
      })
    }
  },[isError, error ,queryClient]);

  return (
    <>
      <div className=" flex absolute">
        <Toaster position="top-right" richColors/>
      </div>
      <Card className="h-full">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Books</CardTitle>
            <CardDescription>Manage your books</CardDescription>
          </div>
          <Link to='/dashboard/books/create'>
            <Button>
              <CirclePlus />
              <span>Add book</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {
            isLoading ? (<div className="flex justify-center items-center py-12">
              <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
            </div>):
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data && data.length >0 ?(
                  data?.map((book: Book, key: number)=>(
                  <TableRow key={key}>
                    <TableCell>
                      <img
                        alt={book.title}
                        className=" aspect-square rounded-md object-cover"
                        height="64"
                        src={book.coverImage}
                        width="64"
                      />
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{book.genre}</Badge>
                    </TableCell>
                    <TableCell>{book.author.name}</TableCell>
                    <TableCell>{book.createdAt}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost">
                            <MoreHorizontal className="h-4 w-4"/>
                            <span className="sr-only">Toggle Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))):(
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No books found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          }
        </CardContent>
      </Card>
    </>
  )
}

export default BooksPage