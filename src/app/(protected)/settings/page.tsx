import { auth } from "@@/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const ProtectedPage = async () => {

  const session = await auth()

  return ( 
    <div className="flex flex-col m-32">
      <h1>
        Protected Page
      </h1>
        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
          </CardHeader>
          <CardContent>
            {JSON.stringify(session)}
          </CardContent>
        </Card>
    </div>
   );
}
 
export default ProtectedPage;