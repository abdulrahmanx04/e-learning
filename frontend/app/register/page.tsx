"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../lib/api";
import { Alert,AlertDescription,AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
export default function RegisterPage () {
    const [name,setName]= useState<string>("")
    const [email,setEmail]= useState<string>("")
    const [password,setPassword]= useState<string>("")
    const [phone,setPhone]= useState<string>("")
    const [error,setError]=useState<string>("")
    const[loading,setLoading]= useState<boolean>(false)
    const[success,setSuccess]= useState<boolean>(false)
    const router= useRouter()

    const handleRegister= async () => {
        setError("")
        setSuccess(false)
        if(!name.trim() || !email.trim() || !password.trim()) {
            setError('Name, email and password are required')
            return
        }
        if (phone.trim() && !/^01[0125][0-9]{8}$/.test(phone.trim())) {
          setError("Phone number must be a valid Egyptian number (e.g. 01234567890)");
          return
        }
     try {
        setLoading(true)
        const response= await api.post('/auth/register', {
            email: email.trim(),
            name: name.trim(),
            password: password.trim(),
            phone: phone?.trim() ?? undefined
        })

        setSuccess(true)
        setTimeout(() => router.push('/login'),3000)
     }catch(error: any) {
        const data= error?.response?.data
        if(Array.isArray(data?.message)) {
            setError(data.message.join(' ,'))
        } else {
            setError(data?.message ?? 'Register failed')
        }
     } finally {
        setLoading(false)
     }
    }
    const onSubmit= (e: React.FormEvent) => {
      e.preventDefault()
      handleRegister()
    }
   return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Register, then verify your email before logging in.
          </CardDescription>
        </CardHeader>

        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {/* alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertTitle>Almost done</AlertTitle>
                <AlertDescription>
                  Account created. Please check your email to verify your account, then log in.
                </AlertDescription>
              </Alert>
            )}

            {/* inputs */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading || success} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading || success} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading || success} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input placeholder="01XXXXXXXXX"id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading || success} />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-4">
            {!success ? (
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </Button>
            ) : (
              <Button className="w-full" type="button" onClick={() => router.push("/login")}>
                Go to login
              </Button>
            )}

            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link className="underline" href="/login">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}