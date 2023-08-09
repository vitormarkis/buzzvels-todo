import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head />
      <body className="__first overflow-y-scroll overflow-x-hidden">
        <Main />
        <NextScript />
        <div
          id="portal"
          className="fixed inset-0 pointer-events-none"
        />
      </body>
    </Html>
  )
}
