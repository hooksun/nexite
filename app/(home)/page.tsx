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
import { SidebarTrigger } from "@/components/ui/sidebar"

const stack = [
  {
    name: "Next.js",
    desc: "Built with Next.js (App Router), TypeScript, and Tailwind CSS. Leveraged Next.js-specific features such as Server-Side Rendering and Server Actions to optimize performance.",
  },
  {
    name: "Supabase",
    desc: "Used Supabase for database and authentication, with RLS policies enforced to secure data access. Utilized Supabase SSR to call APIs server-side, keeping API keys hidden from the browser.",
  },
  {
    name: "Shadcn",
    desc: "Implemented shadcn (Base UI) as the foundation for custom components. Selected and configured components with accessibility in mind, ensuring proper screen reader support and keyboard navigation.",
  },
  {
    name: "React-hook-form",
    desc: "Used React Hook Form to build customizable forms, leveraging features like Controller and useWatch to minimize unnecessary re-renders.",
  },
]

export default function Page() {
  return (
    <main className="flex min-h-svh w-full flex-wrap gap-12 p-6">
      <div className="flex max-w-md min-w-0 grow flex-col gap-4 text-sm">
        <div>
          <h1 className="text-8xl font-bold">Nexite</h1>
          <p className="py-3">
            Built to explore and demonstrate modern full-stack patterns with
            Next.js and Supabase.
          </p>
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
        <SidebarTrigger size="default" variant="default" className="self-start">
          View Pages
        </SidebarTrigger>
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
    </main>
  )
}
