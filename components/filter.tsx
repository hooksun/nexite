"use client"

import { useDataView } from "@/hooks/use-data-view"
import { ReactNode } from "react"
import { FormProvider, useForm } from "react-hook-form"

export default function Filter({
  children,
  className = "contents",
}: {
  children: ReactNode
  className?: string
}) {
  const { setState, pagination } = useDataView()

  const form = useForm()

  const onSubmit = (data: Record<string, string | null>) => {
    setState({
      ...data,
      ...(pagination ? { [pagination.param]: "1" } : {}),
    })
  }

  return (
    <FormProvider {...form}>
      <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  )
}
