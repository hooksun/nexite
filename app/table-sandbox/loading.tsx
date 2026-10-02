import { LoadingContext } from "@/components/loading-context"
import TablePage from "./content"

export default function Loading() {
  return (
    <LoadingContext defaultLoading>
      <TablePage />
    </LoadingContext>
  )
}
