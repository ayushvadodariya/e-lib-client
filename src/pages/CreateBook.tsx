import useBreadcrumbStore, { type BreadcrumbItemType } from "@/store/breadcrumbStore";
import { useEffect } from "react"

function CreateBook() {
  const { setItem } = useBreadcrumbStore((state) => state);
  useEffect(()=>{
    const breadCrumbItems:BreadcrumbItemType[] = [
      {
        label:'Home',
        path: '/dashboard/home'
      },
      {
        label:'Books',
        path: '/dashboard/books'
      },
      {
        label:'Create',
        path: '/dashboard/books/create'
      }
    ]
    setItem(breadCrumbItems);
  },[ setItem ]);

  return (
    <div>CreateBook</div>
  )
}

export default CreateBook