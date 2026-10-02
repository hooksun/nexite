import RequireLogin from "@/components/require-login"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { signOut } from "../auth/actions"
import ButtonLoading from "@/components/ui/button-loading"
import { CircleUser, HatGlasses } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const stack = [
  {
    name: "Next.js",
    desc: "Used Next.js (App Router) with Typescript & Tailwind. Utilized Next.js specific features such as Server Side Rendering, Server actions, etc",
  },
  {
    name: "Supabase",
    desc: "Used Supabase for database & authentication. Implemented RLS Policies to ensure data security. Utilized supabase SSR to call APIs from the server and make API keys not exposed to the browser",
  },
  {
    name: "Shadcn",
    desc: "Used Shadcn (Base UI). Selected appropriate components to ensure accessibility for screen readers",
  },
  {
    name: "React-hook-form",
    desc: "Used react-hook-form to create forms. Utilized features such as  Controller, useWatch, etc to maximize render efficiency",
  },
  // {
  //   name: "Zod",
  //   desc: "Used zod for form validation & type safety",
  // },
]

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-wrap gap-12 p-6">
      <div className="flex max-w-md min-w-0 grow flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="text-8xl font-bold">Nexite</h1>
          <p>Practice project using Next.js & Supabase</p>
          <p>Tech stack used</p>
        </div>

        <Accordion className="gap-6">
          {stack.map((item) => (
            <Card key={item.name} className="py-0">
              <CardContent>
                <AccordionItem value={item.name}>
                  <AccordionTrigger className="items-center text-lg font-bold">
                    {item.name}
                  </AccordionTrigger>
                  <AccordionContent>{item.desc}</AccordionContent>
                </AccordionItem>
              </CardContent>
            </Card>
          ))}
        </Accordion>
      </div>

      <div className="mx-auto flex justify-center self-center">
        <RequireLogin
          render={(user) => (
            <Card className="w-80 self-center">
              <CardHeader className="flex flex-col items-center text-center">
                {user.is_anonymous ? (
                  <HatGlasses size="40" />
                ) : (
                  <CircleUser size="40" />
                )}
                Signed in as
                <br />
                {user.is_anonymous
                  ? "Anonymous"
                  : (user.user_metadata.display_name ?? user.email)}
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                {user.is_anonymous &&
                  "Anonymous accounts can only be accessible in the current session"}
                <ButtonLoading onClick={signOut} variant="secondary">
                  Sign Out
                </ButtonLoading>
              </CardContent>
            </Card>
          )}
        />
      </div>
    </div>
  )
}
