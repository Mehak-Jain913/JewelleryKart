import { useAuth } from '../context/AuthContext.jsx'

const Profile = () => {
  const { user } = useAuth()
  if (!user) return <div className="text-gray-600">You are not logged in.</div>
  return (
    <div>
      <h2 className="text-3xl font-bold text-black mb-6">Profile</h2>
      <div className="space-y-2">
        <div><span className="font-semibold">Name:</span> {user.name}</div>
        <div><span className="font-semibold">Email:</span> {user.email}</div>
      </div>
    </div>
  )
}

export default Profile




