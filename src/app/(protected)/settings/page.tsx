import { auth } from '@@/auth'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import SignOut from '@/components/signOut'

const ProtectedPage = async () => {
  const session = await auth()

  return (
    <div className="flex flex-col m-32">
      <h1>Protected Page</h1>
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent>{JSON.stringify(session)}</CardContent>
      </Card>
      <Card>
        <CardHeader></CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-4">
          <SignOut />
        </CardFooter>
      </Card>
    </div>
  )
}

export default ProtectedPage
