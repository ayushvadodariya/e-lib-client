import { deleteBook, getBooks, updateBook } from "@/http/api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast, Toaster } from "sonner"
import { CirclePlus, Eye, PencilIcon, TrashIcon } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Book, type User } from "@/types"
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
import { z } from 'zod';
import{zodResolver } from "@hookform/resolvers/zod";
import { BookDetailDialog } from "@/components/bookdetail-dialog";
import { format, parseISO } from "date-fns";
import { useUserStore } from "@/store/userStore";

const editFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  genre: z.string().min(2, "Genre must be at least 2 characters."),
  description: z.string().min(2, "Description must be at least 2 characters."),
  coverImage: z.instanceof(FileList).optional(),
  file: z.instanceof(FileList).optional(),
});

type EditFormDataType = z.infer<typeof editFormSchema>;

function BooksPage() {

  const user = useUserStore(state => state.user) as User;

  const [viewingBook, setViewingBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const form = useForm<EditFormDataType>({
      resolver: zodResolver(editFormSchema)
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

  const updateMutation = useMutation({
    mutationFn: (data: EditFormDataType )=>{
      if(!editingBook) throw new Error("No book selected for editing");

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('genre', data.genre);
      formData.append('description', data.description);

      if (data.coverImage && data.coverImage.length > 0) {
        formData.append('coverImage', data.coverImage[0]);
      }

      if (data.file && data.file.length > 0) {
        formData.append('file', data.file[0]);
      }

      return updateBook(editingBook._id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books']});
      toast.success("Book updates successfully!");
      setEditingBook(null);
    },
    onError: (error) => {
      toast.error("Failed to update book",{
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  });

  const onEditSubmit = (values: EditFormDataType) => {
    updateMutation.mutate(values);
  }

  const deleteMutation = useMutation({
    mutationFn: (bookId: string) => {
      return deleteBook(bookId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books']});
      toast.success("Book deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete book", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  });

  const queryClient = useQueryClient();
  
  const {data, error, isLoading, isError} = useQuery<Book[]>({
    queryKey: ['books', user.id],
    queryFn: async () => {
      const response = await getBooks();
      return response.data as Book[];
    },
    staleTime: 1000 * 60 * 30, // 5 minutes
    gcTime: 60 * 60 * 1000     // 60 minutes
  });

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
        path: '/dashboard/home'
      },
      {
        label: 'Books',
        path: '/dashboard/home/books'
      }
    ];
    setItem(breadCrumbItems);
  },[setItem]);
  

  return (
    <>
    <p>{JSON.stringify(user)}</p>
      <div className=" flex absolute">
        <Toaster position="top-right" richColors/>
      </div>
      <Card className="h-[calc(100vh-100px)]">
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
                                    deleteMutation.mutate(book._id);
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
                      disabled={updateMutation.isPending}
                      onClick={(e) => {
                        e.preventDefault();
                        form.handleSubmit(onEditSubmit)();
                      }}
                    >
                      {updateMutation.isPending && <LoaderCircle className="animate-spin" />}
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