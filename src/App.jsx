import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Auth from './pages/Auth'
import Home from './pages/Home'
import QuestDetail from './pages/QuestDetail'
import SavedQuests from './pages/SavedQuests'



export default function App() {
  const { user } = useAuth()

  if (user === undefined) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/auth" />} />
      <Route path="/quest" element={user ? <QuestDetail /> : <Navigate to="/auth" />} />
      <Route path="/saved" element={user ? <SavedQuests /> : <Navigate to="/auth" />} />

    </Routes>
  )
}
