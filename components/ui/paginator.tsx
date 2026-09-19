"use client"

import { Dispatch, HTMLAttributes, SetStateAction, useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

export default function Paginator({
  page,
  setPage,
  pageCount,
  length = Math.min(5, pageCount),
  ...props
}: {
  page: number
  setPage: Dispatch<SetStateAction<number>>
  pageCount: number
  length?: number
} & HTMLAttributes<HTMLElement>) {
  const startPage =
    Math.min(
      pageCount,
      Math.max(1, page - Math.floor(length / 2)) + length - 1
    ) -
    (length - 1)

  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          />
        </PaginationItem>

        {Array.from({ length }, (_, i) => {
          const curr = i + startPage
          if ((i == 0 && curr > 1) || (i == length - 1 && curr < pageCount)) {
            return (
              <PaginationItem key={curr}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem key={curr}>
              <PaginationLink
                onClick={() => setPage(curr)}
                isActive={curr == page}
              >
                {curr}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
