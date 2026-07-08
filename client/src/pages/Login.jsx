import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, signup } = useAuth()
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignup) await signup(name, email, password)
      else await login(email, password)
      navigate('/menu')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← Home</Link>
      <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {isSignup && (
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p className="toggle-auth">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button type="button" className="link-btn" onClick={() => { setIsSignup(!isSignup); setError('') }}>
          {isSignup ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  )
}
