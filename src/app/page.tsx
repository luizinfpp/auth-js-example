import Link from 'next/link'

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-24 gap-8">
      <Link href="/auth/register">Register</Link>
      <Link href="/auth/login">Login</Link>
      <Link href="/settings">Settings</Link>
    </main>
  )
}
