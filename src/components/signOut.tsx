import { signOut } from "@/app/auth"
import { Button } from "./ui/button"
 
export default function SignOutPage() {
  return (
    <div>
      <form
        action={async (formData) => {
          "use server"
          await signOut()
        }}
      >
        <Button type="submit" variant="outline">Sign out</Button>
      </form>
    </div>
  )
}