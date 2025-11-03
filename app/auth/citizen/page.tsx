import Link from 'next/link'
import { UserCircle, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CitizenAuth() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <UserCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Citizen Portal</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            File and track your complaints easily
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Link href="/auth/citizen/signin">
            <Button icon={LogIn} className="w-full">
              Sign In
            </Button>
          </Link>
          
          <Link href="/auth/citizen/signup">
            <Button variant="outline" className="w-full">
              Create New Account
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
