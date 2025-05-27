import { Button } from '@/components/ui/button'
import {Card, CardHeader, CardTitle, CardDescription, CardContent}from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoaderCircle } from 'lucide-react';
import { login } from '@/http/api'
import { useMutation } from '@tanstack/react-query'
import { useRef, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useTokenStore from '@/store';

function LoginPage() {
  const navigate = useNavigate();
  const setToken = useTokenStore((state)=> state.setToken);
  
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef= useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      setToken(response.data.accessToken);
      navigate('/dashboard/home');
    },
  });

  const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password= passwordRef.current?.value;

    if(!email || !password) return alert('Please enter email and password');

    mutation.mutate({email,password});
  }

  return (
    <section className='flex justify-center items-center h-screen'>
      <Card className=' w-1/4'>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e)=>handleLoginSubmit(e)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  ref={emailRef}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input ref={passwordRef} id="password" type="password" required />
              </div>
              {mutation.isError && <span className=' text-red-500 text-sm'>{mutation.error.message}</span>}
              <Button type='submit' className="w-full" disabled={mutation.isPending}>
                <LoaderCircle className={mutation.isPending ? 'animate-spin' : " hidden"}/>
                <span>Login</span>
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={'/auth/register'} className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default LoginPage