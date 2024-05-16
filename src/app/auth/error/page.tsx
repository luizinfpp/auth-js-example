import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const AuthErrorPage = () => {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Oops! Something went wrong.</CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-col items-center justify-center gap-4">
        <Link href="/auth/login">Back to login</Link>
      </CardFooter>
    </Card>
  )
}

export default AuthErrorPage
