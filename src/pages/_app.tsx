import type { AppProps } from "next/app"
import { Inter, Poppins } from "next/font/google"
import { useRouter } from "next/router"

import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"

import { cn } from "@/lib/utils"

import { ClientOnly } from "@/components/others/client-only/ClientOnly"
import { Toaster } from "@/components/ui/toaster"

import { AppProviders } from "@/providers/root"
import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"] })
const poppins = Poppins({
  subsets: ["latin", "devanagari", "latin-ext"],
  variable: "--poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
    <AppProviders>
      <ClientOnly>
        <main className={cn(inter.className, poppins.variable)}>
          <Component {...pageProps} />
        </main>
        <Toaster />
      </ClientOnly>
    </AppProviders>
    </ClerkProvider>
  )
}
