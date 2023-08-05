import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <main className="fixed inset-0 h-screen grid place-items-center">
      <SignUp />
    </main>
  )
}
