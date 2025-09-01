import { SimpleHeader } from '@/components/headers/simple-header'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SimpleHeader />
      <main className="min-h-screen">{children}</main>
    </>
  )
}