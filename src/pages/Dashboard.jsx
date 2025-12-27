import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login')
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setUserData(data)
      }
      setLoading(false)
    }

    fetchUserData()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) return <p className="text-white">Loading...</p>
  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Dashboard</h1>
      <p className="mb-4 text-gray-300">The project is working ✅</p>
      <p className="mb-2"><span className="font-bold">Phone:</span> {userData.phone}</p>
      <p className="mb-2"><span className="font-bold">Balance:</span> {userData.balance}</p>
      <p className="mb-4"><span className="font-bold">Invite Code:</span> {userData.invite_code}</p>
      <button
        onClick={handleLogout}
        className="w-full p-3 bg-[#d4af37] text-black font-bold rounded hover:bg-[#b8962e]"
      >
        Logout
      </button>
    </div>
  )
}
