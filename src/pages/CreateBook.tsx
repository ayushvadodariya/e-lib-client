import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useBreadcrumbStore, { type BreadcrumbItemType } from "@/store/breadcrumbStore";
import { useEffect } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook } from "@/http/api";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createBookFormSchema, type CreateBookFormType } from "@/types/forms";
import { ROUTES } from "@/config/routes";

function CreateBook() {

  const navigate = useNavigate();

  const form = useForm<CreateBookFormType>({
    resolver: zodResolver(createBookFormSchema) 
  });

  const coverImageRef = form.register('coverImage');
  const fileRef= form.register('file');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      navigate('/dashboard/books');
    }
  });


  const onSubmit = (values:CreateBookFormType)=>{
    const formdata = new FormData()
    formdata.append('title', values.title);
    formdata.append('genre', values.genre);
    formdata.append('description', values.description);
    formdata.append('coverImage', values.coverImage[0]);
    formdata.append('file', values.file[0]);

    mutation.mutate(formdata);
  };

  const { setItem } = useBreadcrumbStore((state) => state);

  useEffect(()=>{
    const breadCrumbItems:BreadcrumbItemType[] = [
      {
        label:'Home',
        path: `${ROUTES.APP.HOME}` 
      },
      {
        label:'Books',
        path: `${ROUTES.APP.BOOKS}`
      },
      {
        label:'Create',
        path:`${ROUTES.APP.BOOKS_CREATE}`
      }
    ]
    setItem(breadCrumbItems);
  },[ setItem ]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <div>
              <CardTitle>Create a book</CardTitle>
              <CardDescription>
                Fill out the form below to create a new book.
              </CardDescription>
            </div>
            <div className="flex gap-2">
            <Link to={ROUTES.APP.BOOKS}>
              <Button variant="outline">
                <span>cancel</span>
              </Button>
            </Link>
            <Button type="submit" disabled={mutation.isPending}>
              {
                mutation.isPending && 
                <LoaderCircle className="animate-spin" />
              }
              <span>Submit</span>
              
            </Button>

            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-5">
              <div className="grid gap-4">
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
                          className="w-full min-h-36"
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
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

export default CreateBook