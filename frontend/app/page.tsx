import Link from "next/link"


export default function HomePage() {
  return (
    <main>
      <div style={{display: "flex", gap: 20, marginTop: 20}}>
        <Link href={'/register'}>Register</Link>
        <Link href={'/login'}>Login</Link>
        <Link href={'/courses'}>Courses</Link>
      </div>
    </main>
  )
}