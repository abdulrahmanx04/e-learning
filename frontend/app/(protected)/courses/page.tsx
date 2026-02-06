"use client"
import { Course } from "@/app/types"
import { useState } from "react"
import { useEffect } from "react"
import { api } from "@/app/lib/api"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Clock, Star, BookOpen } from "lucide-react"
import Link from "next/link"


export default function CoursesPage() {
  const [courses,setCourses]= useState<Course[]>([])
  const [loading,setLoading]= useState<boolean>(false)
  const [error,setError]= useState<string>("")
  const router= useRouter()

  const fetchCourses= async () => {
    try {
      setLoading(true)
      setError("")
      const response= await api.get('/courses')
      setCourses(response.data.data)
    }catch(err: any) {
      const data= err?.response?.data
      if(err?.response.status === 401) {
        localStorage.removeItem('token')
        router.replace('/login')
      }  
      setError(data?.message || 'Failed to load courses')    
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchCourses()
  },[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">All Courses</h2>
          <p className="text-gray-600">Explore our collection of courses and start learning today</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
              <p className="text-gray-600">Check back later for new courses</p>
            </CardContent>
          </Card>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden">
                  {course.thumbnailUrl ? (
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  
                  {/* Level Badge */}
                  <Badge 
                    className="absolute top-3 right-3"
                    variant={
                      course.level === 'Beginner' ? 'default' : 
                      course.level === 'Intermediate' ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {course.level}
                  </Badge>

                  {/* Free Badge */}
                  {course.isFree && (
                    <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
                      Free
                    </Badge>
                  )}
                </div>

                {/* Card Content */}
                <CardHeader className="flex-grow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                  </div>
                  
                  <CardTitle className="line-clamp-2 text-lg">
                    {course.title}
                  </CardTitle>
                  
                  <CardDescription className="line-clamp-2 mt-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Instructor */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
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
                    <span className="text-sm text-gray-600">{course.instructor.name}</span>
                  </div>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}h</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {course.rating != null
                          ? Number(course.rating).toFixed(1)
                          : "0.0"}
                  </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-4 border-t">
                  {/* Price */}
                  <div>
                    {course.isFree ? (
                      <span className="text-lg font-bold text-green-600">Free</span>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        ${course.price}
                      </span>
                    )}
                  </div>

                  {/* View Button */}
                  <Link href={`/courses/${course.id}`}>
                    <Button size="sm">
                      View Course
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )

}
