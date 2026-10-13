import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

const navigation = [
  { label: 'Users', path: '/users' },
  { label: 'Teams', path: '/teams' },
  { label: 'Activities', path: '/activities' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Workouts', path: '/workouts' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="navbar navbar-expand-lg container py-3" aria-label="Main navigation">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/users">
            <img src={logo} alt="" className="brand-logo" />
            <span>OctoFit <span className="brand-muted">Tracker</span></span>
          </NavLink>
          <div className="navbar-nav ms-auto flex-row flex-wrap gap-1">
            {navigation.map(({ label, path }) => (
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                key={path}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="container app-main py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<Navigate replace to="/users" />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate replace to="/users" />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="container py-3">Small steps. Stronger together.</div>
      </footer>
    </div>
  )
}

export default App
