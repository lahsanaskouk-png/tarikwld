import { useState } from 'react'
import { supabase } from '../supabase.js'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fakeEmail = `${phone}@fake.domain`

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 mb-4 bg-[#0f0f0f] text-white rounded border border-gray-600"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-[#0f0f0f] text-white rounded border border-gray-600"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-[#d4af37] text-black font-bold rounded hover:bg-[#b8962e]"
        >
          {loading ? 'Processing...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
