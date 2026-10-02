import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"
import RootLayoutClient from "./layout-client"
import { AlertDialogProvider } from "@/hooks/use-alert-dialog"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body className="relative">
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <AlertDialogProvider>
              <RootLayoutClient>{children}</RootLayoutClient>
            </AlertDialogProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
