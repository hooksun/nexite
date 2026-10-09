import { ReactNode } from "react"
import ButtonRefresh from "./button-refresh"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty"

export type EmptyStateProps = {
  media?: ReactNode
  title?: ReactNode
  description?: ReactNode
  content?: ReactNode
  hasRefresh?: ReactNode
}

export default function EmptyState({
  media,
  title,
  description,
  content,
  hasRefresh = true,
}: EmptyStateProps) {
  return (
    <Empty className="py-12">
      <EmptyHeader>
        {media && <EmptyMedia>{media}</EmptyMedia>}
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {hasRefresh && (
          <ButtonRefresh size="default" variant="secondary">
            Refresh
          </ButtonRefresh>
        )}
        {content}
      </EmptyContent>
    </Empty>
  )
}
