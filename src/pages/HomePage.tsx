import { Button } from "@/components/ui/button"
import useBreadcrumbStore, {type BreadcrumbItemType} from "@/store/breadcrumbStore"
import { useEffect } from "react"


function HomePage() {
  const { setItem }= useBreadcrumbStore((state)=>state);

  useEffect(()=>{
    const breadcrumbItem:[BreadcrumbItemType] = [
      {
      label: 'Home',
      path: '/dashboard/home'
      }
    ]
    setItem(breadcrumbItem);
  },[setItem]);

  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-1g border border-dashed shadow-sm h-full min-h-[calc(100vh-4rem)"
      x-chunk = "dashboard-02-chunk-1">
        <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight"> You have no books</h3>
        <p className="text-sm text-muted-foreground">
          You can start selling as soon as you add a book.
        </p>
        <Button className="mt-4">Add Book</Button>
        </div>
      </div>
    </>
  )
}

export default HomePage