'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import SignOut from '@/components/signOut'
import { useCurrentUser } from '@/hooks/useCurrentUser'

const SettingsPage = async () => {
  const user = useCurrentUser()

  return (
    <div className="flex flex-col m-32">
      <h1>Protected Page</h1>
      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
        </CardHeader>
        <CardContent>{JSON.stringify(user)}</CardContent>
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

export default SettingsPage
