import { createClient } from "@/lib/supabase/server"
import { Database } from "@/lib/supabase/supabase-types"
import { SearchParams } from "@/lib/utils"

const getSearchParams = (key: string | string[] | undefined) =>
  Array.isArray(key) ? key : key ? [key] : null

const defaultSelect = "*" as const

export default async function useSupabaseSelect<
  const T extends keyof Database["public"]["Tables"],
  const S extends string = typeof defaultSelect,
>(
  table: T,
  {
    searchParams,
    select = defaultSelect,
    options = { count: "exact", head: false },
  }: {
    searchParams?: Promise<SearchParams>
    select?: S | typeof defaultSelect
    options?: {
      head?: boolean | undefined
      count?: (string & {}) | "exact" | "planned" | "estimated" | undefined
    }
  }
) {
  const params = (await searchParams) ?? {}
  const supabase = await createClient()

  let query = supabase.from(table).select(select, options)

  const Filters = {
    eq: (q, column, value) => q.eq(column as any, value),
    gt: (q, column, value) => q.gt(column, value),
    lt: (q, column, value) => q.lt(column, value),
    gte: (q, column, value) => q.gte(column, value),
    lte: (q, column, value) => q.lte(column, value),
    like: (q, column, value) => q.like(column, value),
    ilike: (q, column, value) => q.ilike(column, value),
    isnull: (q, column) => q.is(column, null),
    notnull: (q, column) => q.not(column, "is", null),
    in: (q, column, value) => q.in(column, value.split(",") as any[]),
    neq: (q, column, value) => q.neq(column as any, value),
    contains: (q, column, value) => q.contains(column, value.split(",")),
    containedby: (q, column, value) => q.containedBy(column, value.split(",")),
  } satisfies Record<
    string,
    (
      q: typeof query,
      column: string & keyof Database["public"]["Tables"][T]["Row"],
      value: string
    ) => typeof query
  >

  type QueryBuilder = {
    query: typeof query
    config: {
      sorting?: {
        param: string
        sorting?: string[]
      }
      pagination?: {
        param: string
        page: number
        pageSize: number
      }
    }
    edit: (func: (q: typeof query) => typeof query) => QueryBuilder
    applyFilters: (param?: string) => QueryBuilder
    applySorting: (param?: string) => QueryBuilder
    paginated: (props?: { param?: string; pageSize?: number }) => QueryBuilder
  } & Record<
    keyof typeof Filters,
    (
      column: string & keyof Database["public"]["Tables"][T]["Row"],
      param: string,
      transform?: (value: string) => string
    ) => QueryBuilder
  >

  const createBuilder: (
    q: typeof query,
    config: QueryBuilder["config"]
  ) => QueryBuilder = (q, config) => ({
    query: q,
    config,
    edit: (func) => createBuilder(func(q), config),
    applyFilters: (param = "filter") => {
      getSearchParams(params[param])?.forEach((filter) => {
        const [column, operator, value] = filter.split(":", 3)

        if (operator in Filters) {
          q = Filters[operator as keyof typeof Filters](q, column as any, value)
        }
      })
      return createBuilder(q, config)
    },
    applySorting: (param = "sort") => {
      const sorting = getSearchParams(params[param]) ?? undefined
      sorting?.forEach((sort) => {
        const [column, dir] = sort.split(":", 2)

        q = q.order(column, { ascending: dir == "asc" })
      })
      return createBuilder(q, {
        ...config,
        sorting: {
          param,
          sorting,
        },
      })
    },
    paginated: ({
      param = "page",
      pageSize = 10,
    }: {
      param?: string
      pageSize?: number
    } = {}) => {
      let page = Number(params[param])

      if (isNaN(page)) page = 1

      return createBuilder(
        q.range((page - 1) * pageSize, page * pageSize - 1),
        {
          ...config,
          pagination: { param, page, pageSize },
        }
      )
    },
    ...(Object.fromEntries(
      Object.entries(Filters).map(([key, value]) => [
        key,
        (
          column: string & keyof Database["public"]["Tables"][T]["Row"],
          param: string,
          transform: (value: string) => string = (value) => value
        ) => {
          const paramValue = getSearchParams(params[param])
          if (paramValue == null) {
            return createBuilder(q, config)
          }
          return createBuilder(
            value(q, column, transform(paramValue[0])),
            config
          )
        },
      ])
    ) as Record<
      keyof typeof Filters,
      (
        column: string & keyof Database["public"]["Tables"][T]["Row"],
        param: string,
        transform?: (value: string) => string
      ) => QueryBuilder
    >),
  })

  return createBuilder(query, {})
}
