import { RegisterFormField } from '@/components/register'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function RegisterPage() {
  return (
    <div className="flex items-center justify-center p-24 gap-8">
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
    </div>
  )
}
