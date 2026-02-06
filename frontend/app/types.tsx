export type Course = {
    id: string
    title: string
    description: string,
    duration: number,
    category: string
    rating: number
    isFree: boolean
    thumbnailUrl: string
    level: string
    price?: number
    instructor: {
      name: string
      avatar: string
    }
}