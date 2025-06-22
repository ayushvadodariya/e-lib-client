import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import useRegister from "@/hooks/useRegister"
import { Label } from "@radix-ui/react-label"
import { LoaderCircle } from "lucide-react"
import { useRef, type FormEvent } from "react"
import { Link } from "react-router-dom"

function RegisterPage() {

  const nameRef= useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef= useRef<HTMLInputElement>(null);

  const registerMutation = useRegister();

  const handleRegisterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name= nameRef.current?.value;
    const email = emailRef.current?.value;
    const password= passwordRef.current?.value;

    if(!name || !email || !password) return alert('Please enter email and password');

    registerMutation.mutate({name, email, password});
  }



  return (
    <section className='flex justify-center items-center h-screen'>
    <Card className="mx-auto max-w-md space-y-2 w-1/4">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Enter your information to create a new account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e)=>handleRegisterSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input ref={nameRef} id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input ref={emailRef} id="email" type="email" placeholder="example@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input ref={passwordRef} id="password" type="password" required />
          </div>
          {registerMutation.isError && <span className=' text-red-500 text-sm'>{registerMutation.error.message}</span>}
          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            <LoaderCircle className={registerMutation.isPending ? 'animate-spin' : " hidden"}/>
            <span>Create an account</span>
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