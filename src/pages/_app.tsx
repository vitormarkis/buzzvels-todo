import { ClientOnly } from "@/components/others/client-only/ClientOnly"
import { AppProviders } from "@/providers/root"
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"
import { Inter, Poppins } from "next/font/google"
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
        </ClientOnly>
      </AppProviders>
    </ClerkProvider>
  )
}

function App__legacy({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter()
  const publicPages = [""]
  const isPublicPage = publicPages.includes(pathname)

  const App = (
    <AppProviders>
      <ClientOnly>
        <Component {...pageProps} />
      </ClientOnly>
    </AppProviders>
  )

  return (
    <ClerkProvider {...pageProps}>
      {isPublicPage ? (
        { App }
      ) : (
        <>
          <SignedIn>{App}</SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      )}
    </ClerkProvider>
  )
}
