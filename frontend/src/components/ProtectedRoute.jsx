import { Navigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ color: "white", padding: "4rem", textAlign: "center" }}>
        Loading...
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  return children
}
