import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function SavedQuests() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPoints, setTotalPoints] = useState(0)

  useEffect(() => {
    fetchSaved()
  }, [])

  async function fetchSaved() {
    try {
      const q = query(collection(db, 'savedQuests'), where('userId', '==', user.uid))
      const snap = await getDocs(q)
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      setQuests(data)
      const points = data.filter(q => q.completed).length * 100
      setTotalPoints(points)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleComplete(quest) {
    try {
      const newCompleted = !quest.completed
      await updateDoc(doc(db, 'savedQuests', quest.id), { completed: newCompleted })
      setQuests(prev => prev.map(q => q.id === quest.id ? { ...q, completed: newCompleted } : q))
      setTotalPoints(prev => newCompleted ? prev + 100 : prev - 100)
    } catch (err) {
      console.error(err)
    }
  }

  const completed = quests.filter(q => q.completed)
  const pending = quests.filter(q => !q.completed)

  const getLevel = (pts) => {
    if (pts >= 1000) return { label: 'Legend', emoji: '🏆' }
    if (pts >= 500) return { label: 'Explorer', emoji: '🧭' }
    if (pts >= 200) return { label: 'Adventurer', emoji: '⚔️' }
    if (pts >= 100) return { label: 'Wanderer', emoji: '🥾' }
    return { label: 'Newcomer', emoji: '🌱' }
  }

  const level = getLevel(totalPoints)

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="btn-ghost" onClick={() => navigate('/')}>← Back</button>
      </div>

      <h1 className="hero-title">My Quests</h1>

      {/* Points card */}
      <div className="points-card">
        <div className="points-left">
          <span className="points-emoji">{level.emoji}</span>
          <div>
            <p className="points-level">{level.label}</p>
            <p className="points-sub">{totalPoints} points</p>
          </div>
        </div>
        <div className="points-bar-wrap">
          <div className="points-bar" style={{ width: `${Math.min((totalPoints % 500) / 5, 100)}%` }} />
        </div>
      </div>

      {loading && <p style={{ color: 'var(--text-2)', marginTop: 24 }}>Loading...</p>}

      {!loading && quests.length === 0 && (
        <div className="empty-state">
          <p>No saved quests yet.</p>
          <button className="btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/')}>
            Find quests →
          </button>
        </div>
      )}

      {pending.length > 0 && (
        <div className="quests-section" style={{ marginTop: 24 }}>
          <p className="quests-label">Saved — {pending.length}</p>
          <div className="quests-grid" style={{ gridTemplateColumns: '1fr' }}>
            {pending.map(q => (
              <SavedCard key={q.id} quest={q} onToggle={toggleComplete} onOpen={() => navigate('/quest', { state: { quest: q } })} />
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="quests-section" style={{ marginTop: 24 }}>
          <p className="quests-label">Completed ✓ — {completed.length}</p>
          <div className="quests-grid" style={{ gridTemplateColumns: '1fr' }}>
            {completed.map(q => (
              <SavedCard key={q.id} quest={q} onToggle={toggleComplete} onOpen={() => navigate('/quest', { state: { quest: q } })} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SavedCard({ quest, onToggle, onOpen }) {
  return (
    <div className={`quest-card saved-card ${quest.completed ? 'completed' : ''}`}>
      <div className="quest-top">
        <span className="quest-emoji">{quest.emoji}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className="quest-cost">{quest.estimatedCost}</span>
          <button
            className={quest.completed ? 'btn-done active' : 'btn-done'}
            onClick={() => onToggle(quest)}
          >
            {quest.completed ? '✓ Done' : 'Mark done'}
          </button>
        </div>
      </div>
      <h3 className="quest-title" style={{ cursor: 'pointer' }} onClick={onOpen}>{quest.title} →</h3>
      {quest.journal && <p className="quest-desc" style={{ fontStyle: 'italic' }}>"{quest.journal}"</p>}
      {quest.learned && <p className="quest-category">💡 {quest.learned}</p>}
      {!quest.journal && !quest.learned && (
        <p className="quest-category" style={{ cursor: 'pointer' }} onClick={onOpen}>Tap to add journal notes →</p>
      )}
    </div>
  )
}