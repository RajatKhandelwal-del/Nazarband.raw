import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../lib/AuthContext"
import "./admin.css"

export default function AdminLogin() {
  const { login, session } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (session) navigate("/admin", { replace: true })
  }, [session, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    const { error } = await login(email, password)
    setSubmitting(false)
    if (error) {
      setError("Invalid email or password")
    } else {
      navigate("/admin")
    }
  }

  return (
    <div className="admin-login">
      <form onSubmit={handleSubmit} className="admin-login-card">
        <h1>Nazarband Admin</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  )
}
