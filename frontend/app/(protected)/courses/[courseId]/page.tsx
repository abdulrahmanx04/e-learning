// app/courses/[id]/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { api } from "../../../lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import { Course } from "@/app/types"
// Define types
interface Lesson {
  id: number
  title: string
  duration?: string
  completed?: boolean
}


export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course| null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const params = useParams()
  const courseId = params.id

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("token")
      
      if (!token) {
        router.push("/login")
        return
      }

      // Fetch single course by ID
      const response = await api.get(`/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setCourse(response.data)
    } catch (err: any) {
      const data = err?.response?.data

      if (err?.response?.status === 401) {
        localStorage.removeItem("token")
        router.push("/login")
        return
      }

      setError(data?.message || "Failed to load course details")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/courses">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </Link>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full mt-4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ) : !course ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Course not found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Course Header */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{course.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.instructor && (
                  <p className="text-sm">
                    <span className="font-medium">Instructor:</span> {course.instructor.name}
                  </p>
                )}
                {course.duration && (
                  <p className="text-sm">
                    <span className="font-medium">Duration:</span> {course.duration}
                  </p>
                )}
              </CardContent>
            </Card>
            
          </div>
        )}
      </div>
    </div>
  )
}