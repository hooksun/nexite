"use client"

import { usePathState } from "@/hooks/use-path-state"
import { ReactNode } from "react"
import { FormProvider, useForm } from "react-hook-form"

export default function Filter({
  children,
  className = "contents",
  filters,
}: {
  children: ReactNode
  className?: string
  filters?: string[]
}) {
  const { searchParams, setState } = usePathState()

  const form = useForm({
    defaultValues: filters?.reduce(
      (accumulator, key) => ({
        ...accumulator,
        [key]: searchParams.get(key) ?? "",
      }),
      {}
    ),
  })

  const onSubmit = (data: Record<string, string>) => {
    setState({
      page: "1",
      ...filters?.reduce(
        (accumulator, key) => ({
          ...accumulator,
          [key]: data[key] ?? null,
        }),
        {}
      ),
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
