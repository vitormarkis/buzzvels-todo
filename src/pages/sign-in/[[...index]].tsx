import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <main className="fixed inset-0 h-screen grid place-items-center">
      <SignIn />
    </main>
  )
}
