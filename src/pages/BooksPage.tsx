import { useQueryClient } from "@tanstack/react-query"
import { toast, Toaster } from "sonner"
import { CirclePlus, Eye, PencilIcon, TrashIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Book } from "@/types/types"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import useBreadcrumbStore, { type BreadcrumbItemType} from "@/store/breadcrumbStore"
import { Link } from "react-router-dom";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookDetailDialog } from "@/components/book-detail-dialog";
import { format, parseISO } from "date-fns";
import { type EditFormDataType, editBookFromSchem} from '@/types/forms';
import { useDeleteBook } from "@/hooks/useDeleteBook";
import { useEditBook } from "@/hooks/useEditBook";
import { useBooks } from "@/hooks/useBooks";
import { ROUTES } from "@/config/routes";

function BooksPage() {

  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const form = useForm<EditFormDataType>({
      resolver: zodResolver(editBookFromSchem)
  });

  useEffect(()=>{
    if(editingBook) {
      form.reset({
        title: editingBook.title,
        genre: editingBook.genre,
        description: editingBook.description
      });
    }
  },[editingBook, form]);

  const coverImageRef = form.register('coverImage');
  const fileRef = form.register('file');

  const editBookMutation = useEditBook({
    editingBook,
    onSuccess: (editedBook) => {
      setEditingBook(null);
      form.reset();
      console.log(JSON.stringify(editedBook));
    }
  })

  const onEditSubmit = (values: EditFormDataType) => {
    editBookMutation.mutate(values);
  }

  const deleteBookMutation = useDeleteBook();

  const queryClient = useQueryClient();

  const {books, error, isLoading, isError} = useBooks();

  useEffect(()=>{
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
  
  const { setItem } = useBreadcrumbStore((state)=>state);

  useEffect(()=>{
    const breadCrumbItems:BreadcrumbItemType[] = [
      {
        label: 'Home',
        path: `${ROUTES.APP.HOME}`
      },
      {
        label: 'Books',
        path: `${ROUTES.APP.BOOKS}`
      }
    ];
    setItem(breadCrumbItems);
  },[setItem]);
  

  return (
    <>
      <div className=" flex absolute">
        <Toaster position="top-right" richColors/>
      </div>
      <Card className="h-[calc(100vh-100px)]">
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Books</CardTitle>
            <CardDescription>Manage your books</CardDescription>
          </div>
          <Link to={ROUTES.APP.BOOKS_CREATE}>
            <Button>
              <CirclePlus />
              <span>Add book</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="overflow-auto h-[calc(100vh-10rem)]">
          {
            isLoading ? (<div className="flex justify-center items-center py-12">
              <LoaderCircle className="animate-spin h-10 w-10 text-primary" />
            </div>):
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background border-b">
                <TableRow>
                  <TableHead className="w-[100px]"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books && books.length >0 ?(
                  books?.map((book: Book, key: number)=>(
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
                      <TableCell>
                        {format(parseISO(book.createdAt), "MMM d, yyyy")}
                      </TableCell>
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
                          <DropdownMenuItem 
                          className="cursor-pointer flex items-center gap-2"
                          onClick={()=>{
                            setEditingBook(book);
                          }}>
                            <PencilIcon className="h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                            onClick={() => {
                              // Add your delete logic here
                              toast.warning(`Delete ${book.title}?`, {
                                description: "This action cannot be undone.",
                                action: {
                                  label: "Delete",
                                  onClick: () => {
                                    deleteBookMutation.mutate(book._id);
                                  }
                                }
                              });
                            }}>
                            <TrashIcon className="h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer flex items-center gap-2"
                              onClick={() => {
                                setViewingBook(book);
                              }}>
                              <Eye className="h-4 w-4" />
                              <span>View Details</span>
                            </DropdownMenuItem>
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
          <Dialog open={!!editingBook} onOpenChange={(open)=>!open && setEditingBook(null)}>
            <Form {...form}>
              <form>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Book</DialogTitle>
                    <DialogDescription>
                      Make changes to your Book here. Click save when you&apos;re
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <FormField 
                    control={form.control}
                    name="title"
                    render={({ field })=>(
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            type="text"
                            className="w-full"
                            {...field}
                          >
                          </Input>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  >
                  </FormField>
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field })=>(
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Input
                            id="genre"
                            type="text"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  >
                  </FormField>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field })=>(
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            id="description"
                            className="w-full h-36 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  >
                  </FormField>
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={()=>(
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>

                          <Input 
                            id="file" 
                            type="file" 
                            {...coverImageRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  >
                  </FormField>
                  <FormField
                    control={form.control}
                    name="file"
                    render={()=>(
                      <FormItem>
                        <FormLabel>File</FormLabel>
                        <FormControl>
                          <Input 
                            id="file" 
                            type="file" 
                            {...fileRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  >
                  </FormField>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button 
                      type="submit" 
                      disabled={editBookMutation.isPending}
                      onClick={(e) => {
                        e.preventDefault();
                        form.handleSubmit(onEditSubmit)();
                      }}
                    >
                      {editBookMutation.isPending && <LoaderCircle className="animate-spin" />}
                      <span>Save Changes</span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Form>
          </Dialog>
          <BookDetailDialog 
            book={viewingBook} 
            open={!!viewingBook} 
            onOpenChange={(open) => !open && setViewingBook(null)} 
          />
        </CardContent>
      </Card>
    </>
  )
}

export default BooksPage