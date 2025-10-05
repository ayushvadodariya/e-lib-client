import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Sparkles, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createBookFormSchema, type CreateBookFormType } from "@/types/forms";
import { ROUTES } from "@/config/routes";
import useCreateBook from "@/hooks/useCreateBook";
import { useFixGrammar } from "@/hooks/useFixGrammar";
import { useImproveDescription } from "@/hooks/useImproveDescription";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";

function CreateBook() {

  const navigate = useNavigate();
  const [improvementPrompt, setImprovementPrompt] = useState("");
  const [showPromptDialog, setShowPromptDialog] = useState(false);

  const form = useForm<CreateBookFormType>({
    resolver: zodResolver(createBookFormSchema) 
  });

  const coverImageRef = form.register('coverImage');
  const fileRef= form.register('file');

  const queryClient = useQueryClient();

  const createBookMutation = useCreateBook({
   onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['books']});
    navigate(ROUTES.APP.BOOKS);
   }
  });

  const fixGrammarMutation = useFixGrammar();
  const improveDescriptionMutation = useImproveDescription();

  const handleFixGrammar = async () => {
    const currentDescription = form.getValues('description');
    
    if (!currentDescription || currentDescription.trim() === '') {
      toast.error("Please enter a description first");
      return;
    }

    try {
      const result = await fixGrammarMutation.mutateAsync(currentDescription) as { data: { correctedText: string } };
      const correctedText = result.data.correctedText;
      form.setValue('description', correctedText);
      toast.success("Grammar and spelling corrected!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fix grammar";
      toast.error(errorMessage);
    }
  };

  const handleImproveDescription = async (customPrompt?: string) => {
    const currentDescription = form.getValues('description');
    
    if (!currentDescription || currentDescription.trim() === '') {
      toast.error("Please enter a description first");
      return;
    }

    try {
      const result = await improveDescriptionMutation.mutateAsync({ 
        text: currentDescription, 
        prompt: customPrompt 
      }) as { data: { improvedText: string } };
      
      const improvedText = result.data.improvedText;
      form.setValue('description', improvedText);
      toast.success(customPrompt ? "Description improved with your instructions!" : "Description improved!");
      setShowPromptDialog(false);
      setImprovementPrompt("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to improve description";
      toast.error(errorMessage);
    }
  };


  const onSubmit = (values:CreateBookFormType)=>{
    const formdata = new FormData()
    formdata.append('title', values.title);
    formdata.append('genre', values.genre);
    formdata.append('description', values.description);
    if(values.coverImage && values.coverImage.length>0){
      formdata.append('coverImage', values.coverImage[0]);
    }
    if(values.file && values.file.length>0){
      formdata.append('file', values.file[0]);
    }

    createBookMutation.mutate(formdata);
  };

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
            <Button type="submit" disabled={createBookMutation.isPending}>
              {
                createBookMutation.isPending && 
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
                      <div className="flex justify-between items-center">
                        <FormLabel>Description</FormLabel>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={handleFixGrammar}
                            disabled={fixGrammarMutation.isPending}
                          >
                            {fixGrammarMutation.isPending && <LoaderCircle className="animate-spin mr-2 h-4 w-4" />}
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Fix Grammar
                          </Button>
                          
                          <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
                            <DialogTrigger asChild>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                disabled={improveDescriptionMutation.isPending}
                              >
                                {improveDescriptionMutation.isPending && <LoaderCircle className="animate-spin mr-2 h-4 w-4" />}
                                <Sparkles className="mr-2 h-4 w-4" />
                                Improve Description
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                              <DialogHeader>
                                <DialogTitle>Improve Description</DialogTitle>
                                <DialogDescription>
                                  Optionally provide specific instructions for how you'd like to improve the description (e.g., "make it more exciting", "add more mystery", "make it professional"). Leave blank for general improvement.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="improvement-prompt">
                                    Custom Instructions (Optional)
                                  </Label>
                                  <Textarea
                                    id="improvement-prompt"
                                    placeholder="e.g., make it more engaging and add suspense..."
                                    value={improvementPrompt}
                                    onChange={(e) => setImprovementPrompt(e.target.value)}
                                    className="min-h-24"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setShowPromptDialog(false);
                                    setImprovementPrompt("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => handleImproveDescription(improvementPrompt || undefined)}
                                  disabled={improveDescriptionMutation.isPending}
                                >
                                  {improveDescriptionMutation.isPending && <LoaderCircle className="animate-spin mr-2 h-4 w-4" />}
                                  Improve
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
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
                          id="coverImage" 
                          type="file" 
                          accept="image/jpeg,image/jpg,image/png"
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
                      <FormLabel>File (PDF)</FormLabel>
                      <FormControl>
                        <Input 
                          id="file" 
                          type="file" 
                          accept="application/pdf,application/epub+zip"
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