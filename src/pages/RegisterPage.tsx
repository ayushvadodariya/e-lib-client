import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@radix-ui/react-label"
import { Link } from "react-router-dom"

function RegisterPage() {

  return (
    <section className='flex justify-center items-center h-screen'>
    <Card className="mx-auto max-w-md space-y-2 w-1/4">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Enter your information to create a new account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="example@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to={'/auth/login'} className=" underline">Sign in</Link>
          </div>
        </form>
      </CardContent>
    </Card>
    </section>
  )
}

export default RegisterPage