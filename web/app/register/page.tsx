"use client"  // ✅ Correct (you wrote "use-clinet")

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "../lib/api"  // Also fix: "..//lib/api" should be "../lib/api"
import Link from "next/link"

export default function Register() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const[phone, setPhone]= useState<string | undefined>(undefined)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    setError('')
    try {
      setLoading(true)
      
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        phone: phone?.trim() || undefined
      })
      
      console.log('Registration success:', response.data)
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
    } catch(error: any) {
      const data= error.response?.data
      if(Array.isArray(data.message)) {
        setError(data.message.join(' ,'))
      } else {
        setError(data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '24px',
          borderRadius: '12px',
          backgroundColor: '#111827',
          boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>
          Create account
        </h2>
        <p style={{ marginBottom: '20px', fontSize: '14px', color: '#9CA3AF' }}>
          Sign up to start using the platform.
        </p>
        
        {error && (
          <p
            style={{
              color: '#FCA5A5',
              background: 'rgba(248, 113, 113, 0.1)',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {error}
          </p>
        )}
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
            Full name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #374151',
              borderRadius: '8px',
              backgroundColor: '#020617',
              color: '#E5E7EB',
              outline: 'none',
            }}
          />
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #374151',
              borderRadius: '8px',
              backgroundColor: '#020617',
              color: '#E5E7EB',
              outline: 'none',
            }}
          />
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #374151',
              borderRadius: '8px',
              backgroundColor: '#020617',
              color: '#E5E7EB',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>
            Phone (optional)
          </label>
          <input
            type="text"
            placeholder="+1 555 000 0000"
            value={phone || ''}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #374151',
              borderRadius: '8px',
              backgroundColor: '#020617',
              color: '#E5E7EB',
              outline: 'none',
            }}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '15px',
            fontWeight: 500,
            backgroundColor: loading ? '#4B5563' : '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s ease',
            marginBottom: '12px',
          }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        
        <p style={{ fontSize: '13px', textAlign: 'center', color: '#9CA3AF' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#60A5FA' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}