import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooks } from "@/hooks/useBooks"
import { useSyncUser } from "@/hooks/useSyncUser";
import { useNavigate } from "react-router-dom";
import { Book, CalendarDays, PencilIcon } from 'lucide-react';
import BookCard from "@/components/book-card";
import { ROUTES } from "@/config/routes";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import EditProfilDialog from "@/components/edit-profile-dialog";
import type { User } from "@/types/types";

export default function ProfilePage() {

  const navigate = useNavigate();

  const [editingProfile, setEditingProfile] = useState<boolean>(false);

  const {
    user,
    isLoading: userLoading,
    error: userError
  }= useSyncUser();

  const {
    books,
    isLoading: booksLoading,
    error: booksError
  } = useBooks();

  const isConnectionError = userError &&
    userError.message?.includes('Network Error');

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  if(userError){
    return (
      <div className="container max-w-7xl py-10">
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground mt-2">
            {isConnectionError 
              ? "Unable to connect to server. Please check your internet connection." 
              : "The user you're looking for doesn't exist."}
          </p>
          <Button onClick={() => isConnectionError ? window.location.reload() : navigate('/')} className="mt-4">
            {isConnectionError ? "Retry" : "Go Home"}
          </Button>
        </div>
      </div>
    );
  }

    if(userLoading) {
      return (
        <div className="container max-w-7xl py-10">
          <div className="flex items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
              <div className="flex space-x-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="container max-w-7xl py-10">
      {/* Author profile header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-10">
        <div className="pt-2">
          <Avatar className="h-24 w-24 rounded-full">
            <AvatarImage 
              src={user?.profilePhoto || undefined} 
              alt={user?.name} 
              className="object-cover h-full w-full"
            />
            <AvatarFallback className="text-3xl">
              {user?.name?.charAt(0) || user?.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <Button variant="outline" size="sm" 
              className="flex items-center gap-1"
              onClick={handleEditProfile}
            >
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
              <PencilIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-muted-foreground">@{user?.username}</p>
          
          {user?.bio && (
            <p className="max-w-3xl mt-2">{user.bio}</p>
          )}

          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span>{books?.length || 0} Books</span>
            </div>
            
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Joined {user?.createdAt ? format(parseISO(user.createdAt.toString()), 'MMMM yyyy') : 'Recently'}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Books by author */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Books</h2>
        </div>
        
        {booksLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[240px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : books?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard 
                key={book._id} 
                book={book}
                onClick={()=>{
                  navigate(`${ROUTES.APP.READ}?b=${book._id}`);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border bg-muted">
              <Book className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No Books Published Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This author hasn't published any books yet.
            </p>
          </div>
        )}
      </div>
      <EditProfilDialog 
        user = {user as User}
        open= {editingProfile} 
        onOpenChange= {(open: boolean) => !open && setEditingProfile(false)}
      />
    </div>
  );
}