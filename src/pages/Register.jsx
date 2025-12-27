import { useState } from 'react'
import { supabase } from '../supabase.js'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function Register() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const inviteCode = searchParams.get('inviteCode') || ''

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const fakeEmail = `${phone}@fake.domain`

    const { data, error: authError } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // After signup, trigger handles insert, but update invited_by if present
    if (inviteCode) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ invited_by: inviteCode })
        .eq('id', data.user.id)

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }
    }

    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleRegister}>
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
        <input
          type="text"
          placeholder="Invite Code"
          value={inviteCode}
          disabled={!!inviteCode}
          className="w-full p-3 mb-4 bg-[#0f0f0f] text-white rounded border border-gray-600 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-[#d4af37] text-black font-bold rounded hover:bg-[#b8962e]"
        >
          {loading ? 'Processing...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
