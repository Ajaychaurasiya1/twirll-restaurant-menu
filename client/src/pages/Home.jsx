import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="page home-page">
      <h1>Twirll Cafe</h1>
      <p>Browse our menu or sign in to your account.</p>
      <div className="home-actions">
        <Link to="/menu" className="btn btn-primary">Menu</Link>
        <Link to="/login" className="btn btn-secondary">Login</Link>
      </div>
    </div>
  )
}
