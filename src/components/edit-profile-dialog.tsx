import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTitle} from "@/components/ui/dialog"
import { Camera, X } from "lucide-react"
import type { User } from "@/types/types"
import { useForm } from "react-hook-form"
import { editUserFormSchema, type editUserSchemType } from "@/types/forms"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useRef, useState } from "react"
import useEditUserProfile from "@/hooks/useEditUserProfile"

interface EditProfilDialogProp {
  user: User
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfilDialog({ user, open, onOpenChange }: EditProfilDialogProp) {
  
  const form = useForm<editUserSchemType>({
    resolver: zodResolver(editUserFormSchema)
  });

  const [preview, setPreview] = useState<string>(user?.profilePhoto || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log("file we got in handleFileChange is ", file);
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const editUserProfileMutaion = useEditUserProfile({});

  const handleSaveProfile = (values: editUserSchemType) => {
    console.log("click save profile");
    const formData = new FormData();
    
    // Add text fields only if they have values
    if (values.name) {
      formData.append("name", values.name);
    }
    if (values.bio) {
      formData.append("bio", values.bio);
    }
    
    // Add the profile photo if a new file was selected
    if (selectedFile) {
      formData.append("profilePicture", selectedFile);
    }
    
    console.log("FormData contents:");
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    editUserProfileMutaion.mutate(formData);
    onOpenChange(!open);
  };


  return (
      <Dialog open={open} onOpenChange={onOpenChange} >
        <DialogContent className="sm:max-w-[600px] p-0 bg-white" showCloseButton={false}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveProfile)}>
              {/* Custom Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-700 hover:bg-gray-100"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  <DialogTitle className="text-xl font-semibold text-gray-900">Edit profile</DialogTitle>
                </div>
                <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-white px-6" >
                  Save
                </Button>
              </div>

              {/* Profile Picture Section */}
              <div className="p-4 pb-6">
                <div className="relative w-32 h-32">
                  <Avatar className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover shadow-lg">
                    <AvatarImage 
                      src={preview} 
                      alt={user?.name} 
                      className="object-cover h-full w-full"
                    />
                    <AvatarFallback className="text-3xl">
                      {user?.name?.charAt(0) || user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300"
                    onClick={handleCameraClick}
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </Button>
                  <input 
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    ref={fileInputRef}
                    style={{ display: "none"}}
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="px-4 pb-6 space-y-6">
                <FormField
                  control={form.control}
                  name= "name"
                  render = {({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          defaultValue= {user.name}
                          className="bg-white border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500"
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
                  name= "bio"
                  render={({field})=>(
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Bio
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          id="bio"
                          defaultValue={user.bio}
                          rows={4}
                          className=" w-full h-36 resize-none bg-white border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-gray-500"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                >
                </FormField>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  )
}
