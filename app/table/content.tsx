"use client"

import DataTable from "@/components/data-table"
import { Search } from "lucide-react"
import FilterField from "@/components/filter-field"
import { formInput } from "@/components/form-inputs"
import { dataColumn, numberColumn } from "@/components/data-table-columns"
import {
  FilterDateRange,
  FilterForm,
  FilterRange,
} from "@/components/data-table-filters"
import Header from "@/components/ui/header"

export default function TablePage() {
  return (
    <>
      <Header title="Simple Table" />
      <main className="flex flex-col gap-6 p-6 pt-2">
        <DataTable
          columns={[
            numberColumn(),
            dataColumn("date", {
              filter: (
                <FilterDateRange startParam="start-date" endParam="end-date" />
              ),
            }),
            dataColumn("name", {
              filter: (
                <FilterForm>
                  <FilterField
                    name="name"
                    render={formInput({ left: <Search />, clear: true })}
                  />
                </FilterForm>
              ),
            }),
            dataColumn("email", {
              filter: (
                <FilterForm>
                  <FilterField
                    name="email"
                    render={formInput({ left: <Search />, clear: true })}
                  />
                </FilterForm>
              ),
            }),
            dataColumn("age", {
              renderFooter: ({ aggregate }) =>
                Number(aggregate?.at(0)?.avg_age.toFixed(2)),
              filter: <FilterRange startParam="start-age" endParam="end-age" />,
            }),
            dataColumn("gender"),
            dataColumn("salary", {
              headerClassName: "justify-end",
              cellClassName: "text-right",
              footerClassName: "text-right",
              render: (row) => `$ ${row.salary}`,
              renderFooter: ({ aggregate }) =>
                `$ ${aggregate?.at(0)?.avg_salary.toFixed(2)}`,
              filter: (
                <FilterRange startParam="start-salary" endParam="end-salary" />
              ),
            }),
            dataColumn("company", {
              filter: (
                <FilterForm>
                  <FilterField
                    name="company"
                    render={formInput({ left: <Search />, clear: true })}
                  />
                </FilterForm>
              ),
            }),
            dataColumn("occupation", {
              filter: (
                <FilterForm>
                  <FilterField
                    name="occupation"
                    render={formInput({ left: <Search />, clear: true })}
                  />
                </FilterForm>
              ),
            }),
            dataColumn("education", {
              filter: (
                <FilterForm>
                  <FilterField
                    name="education"
                    render={formInput({ left: <Search />, clear: true })}
                  />
                </FilterForm>
              ),
            }),
            dataColumn("skill", {
              filter: (
                <FilterForm>
                  <FilterField
                    name="skill"
                    render={formInput({ left: <Search />, clear: true })}
                  />
                </FilterForm>
              ),
            }),
          ]}
          footerLabel="Average"
          getRowId={(row) => row.id as string | number}
        />
        <div className="text-muted-foreground">
          Data generated using{" "}
          <a
            className="cursor-pointer hover:underline"
            target="_blank"
            href="https://www.mockaroo.com"
          >
            https://www.mockaroo.com
          </a>
        </div>
      </main>
    </>
  )
}
