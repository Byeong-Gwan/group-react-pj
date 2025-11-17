import './nav.css'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  const items = [
    { to: '/', label: '대시보드', match: /^\/$/ },
    { to: '/add', label: '지출 입력', match: /^\/add/ },
    { to: '/history', label: '내역', match: /^\/history/ },
    { to: '/board', label: '보드', match: /^\/board/ },
    { to: '/report', label: 'AI 리포트', match: /^\/report/ },
  ]
  return (
    <nav className="top-nav">
      <div className="nav-left">
        <Link to="/" className="logo" aria-label="영수증 홈">영 수 증</Link>
      </div>
      <div className="nav-center">
        {items.map((it) => (
          <Link key={it.to} to={it.to} className={`nav-btn ${it.match.test(pathname) ? 'active' : ''}`}>
            {it.label}
          </Link>
        ))}
      </div>
      <div className="nav-right" />
    </nav>
  )
}
