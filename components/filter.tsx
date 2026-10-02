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
  const { setState } = useDataView()

  const form = useForm()

  const onSubmit = (data: Record<string, string | null>) => {
    setState({
      ...data,
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
