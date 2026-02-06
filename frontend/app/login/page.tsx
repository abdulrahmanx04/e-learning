"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import Link from "next/link";
import { Alert,AlertDescription,AlertTitle } from "@/components/ui/alert";  
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card,CardFooter,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";


export default function LoginPage() {
    const [email,setEmail]=useState<string>("")
    const [password,setPassword]=useState<string>("")
    const [error,setError]=useState<string>("")
    const[loading,setLoading]=useState<boolean>(false)
    const[success,setSuccess]=useState<boolean>(false)
    const router= useRouter()
    const handleLogin= async () => {
        setError("")
        setSuccess(false)

        try {
            setLoading(true)
            const response= await api.post('/auth/login', {
                email: email.trim(),
                password: password.trim()
            })

            localStorage.setItem('token',response.data.token)
           
            setSuccess(true)

            setTimeout(() => router.push('/courses'),1000)
        }catch(err: any) {
            const data =err?.response?.data
            if(Array.isArray(data?.message)) {
                setError(data.message.join(' ,'))
            } else {
                setError(data.message ||'Login Failed')
            }
        }finally {
            setLoading(false)
        } 
    }
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();   
        handleLogin();        
    };
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Log in to continue to your courses.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Login failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Logging you in...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground underline"
                >
                  Forgot?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="underline" href="/register">
              Register
            </Link>
          </p>

          <Link className="text-sm underline" href="/">
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}