import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { register } from "@/http/api"
import useTokenStore from "@/store"
import { Label } from "@radix-ui/react-label"
import { useMutation } from "@tanstack/react-query"
import { LoaderCircle } from "lucide-react"
import { useRef, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

function RegisterPage() {

  const setToken = useTokenStore((state)=> state.setToken);

  const navigate = useNavigate();
  
  const nameRef= useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef= useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (response) => {
      setToken(response.data.accessToken);
      navigate('/dashboard/home');
    },
  });

  const handleRegisterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name= nameRef.current?.value;
    const email = emailRef.current?.value;
    const password= passwordRef.current?.value;

    if(!name || !email || !password) return alert('Please enter email and password');

    mutation.mutate({name, email, password});
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
          {mutation.isError && <span className=' text-red-500 text-sm'>{mutation.error.message}</span>}
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            <LoaderCircle className={mutation.isPending ? 'animate-spin' : " hidden"}/>
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