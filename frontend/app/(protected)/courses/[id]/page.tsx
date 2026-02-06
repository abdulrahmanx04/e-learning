"use client"

import { api } from "@/app/lib/api"
import { Course } from "@/app/types"
import { notFound, useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Clock, Star, BookOpen, PlayCircle, User } from "lucide-react"
import Link from "next/link"

export default function CoursePage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const params = useParams<{id: string}>()
  const id = params.id

  const fetchCourse = async () => {
    try {
      setLoading(true)
      setError("")
      const token = localStorage.getItem('token')
      const response = await api.get(`/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setCourse(response.data)
    } catch (err: any) {
      const data = err?.response?.data
      if (err.response?.status === 404) {
        router.replace('/courses')
        return
      }
      setError(data?.message || 'Failed to load course')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCourse()
  },[id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link href="/courses">
          <Button variant="ghost" className="mb-6 hover:bg-white/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </Link>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {/* Loading State */}
        {loading ? (
          <div className="space-y-6">
            <Card className="overflow-hidden animate-pulse">
              <div className="h-96 bg-gray-200" />
              <CardHeader>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </CardHeader>
            </Card>
          </div>
        ) : !course ? (
          <Card>
            <CardContent className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h3>
              <p className="text-gray-600 mb-6">The course you're looking for doesn't exist</p>
              <Link href="/courses">
                <Button>Browse All Courses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header Card */}
              <Card className="overflow-hidden shadow-xl">
                {/* Thumbnail/Hero Image */}
                <div className="relative h-96 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-32 h-32 text-white/30" />
                    </div>
                  )}
                  
                  {/* Overlay with badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    {course.isFree && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        Free Course
                      </Badge>
                    )}
                    <Badge 
                      variant={
                        course.level === 'Beginner' ? 'default' : 
                        course.level === 'Intermediate' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {course.level}
                    </Badge>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <Badge variant="outline" className="mb-3 bg-white/20 backdrop-blur-sm text-white border-white/30">
                      {course.category}
                    </Badge>
                    <h1 className="text-4xl font-bold text-white mb-2">
                      {course.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-5 h-5" />
                        <span>{course.duration} hours</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl">About This Course</CardTitle>
                  <CardDescription className="text-base leading-relaxed mt-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* What You'll Learn Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    What You'll Learn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Master the fundamentals of " + course.category,
                      "Build real-world projects from scratch",
                      "Learn industry best practices and techniques",
                      "Get hands-on experience with practical examples"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Instructor Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    Your Instructor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                      {course.instructor.avatar ? (
                        <img 
                          src={course.instructor.avatar} 
                          alt={course.instructor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        course.instructor.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {course.instructor.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Course Instructor
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 shadow-xl">
                <CardHeader className="text-center pb-4">
                  {course.isFree ? (
                    <div>
                      <p className="text-4xl font-bold text-green-600 mb-2">Free</p>
                      <p className="text-sm text-gray-600">Full access at no cost</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-4xl font-bold text-gray-900 mb-2">
                        ${course.price}
                      </p>
                      <p className="text-sm text-gray-600">One-time payment</p>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <Button className="w-full h-12 text-lg" size="lg">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    {course.isFree ? 'Start Learning' : 'Enroll Now'}
                  </Button>

                  <div className="pt-4 border-t space-y-3">
                    <h4 className="font-semibold text-gray-900 mb-3">This course includes:</h4>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>{course.duration} hours of content</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <BookOpen className="w-5 h-5 text-gray-400" />
                      <span>Full lifetime access</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Access on mobile and desktop</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}