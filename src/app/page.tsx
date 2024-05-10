import { RegisterFormField } from '@/components/register'
import { auth } from '@@/auth'
import { SignIn } from '@/components/signIn'
import SignOut from '@/components/signOut'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex items-center justify-center p-24 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent>{JSON.stringify(session)}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Insert your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <RegisterFormField />
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Insert your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-4">
          <SignIn />
          <SignOut />
        </CardFooter>
      </Card>
    </main>
  )
}
