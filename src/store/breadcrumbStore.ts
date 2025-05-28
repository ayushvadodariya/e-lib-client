import { create }from 'zustand';
import { devtools, persist} from 'zustand/middleware';

export type BreadcrumbItemType = {
  label: string,
  path: string
}
interface BreadcrumbState {
  items: BreadcrumbItemType[],
  setItem: (item: BreadcrumbItemType[]) => void
}

const useBreadcrumbStore = create<BreadcrumbState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        setItem :(items: BreadcrumbItemType[]) => set({ items })
      }),
      {
        name: 'breadcrumb-store'
      }
    )
  )
)


export default useBreadcrumbStore;