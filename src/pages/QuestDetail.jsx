import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'

export default function QuestDetail() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const quest = state?.quest

  const [saved, setSaved] = useState(false)
  const [savedDocId, setSavedDocId] = useState(null)
  const [journal, setJournal] = useState('')
  const [learned, setLearned] = useState('')
  const [saving, setSaving] = useState(false)
  const [journalSaved, setJournalSaved] = useState(false)

  useEffect(() => {
    if (!quest) return
    checkIfSaved()
  }, [quest])

  async function checkIfSaved() {
    try {
      const q = query(
        collection(db, 'savedQuests'),
        where('userId', '==', user.uid),
        where('title', '==', quest.title)
      )
      const snap = await getDocs(q)
      if (!snap.empty) {
        setSaved(true)
        setSavedDocId(snap.docs[0].id)
        const data = snap.docs[0].data()
        setJournal(data.journal || '')
        setLearned(data.learned || '')
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function toggleSave() {
    setSaving(true)
    try {
      if (saved) {
        await deleteDoc(doc(db, 'savedQuests', savedDocId))
        setSaved(false)
        setSavedDocId(null)
      } else {
        const docRef = await addDoc(collection(db, 'savedQuests'), {
          userId: user.uid,
          title: quest.title,
          emoji: quest.emoji,
          description: quest.description,
          estimatedCost: quest.estimatedCost,
          category: quest.category,
          journal: '',
          learned: '',
          savedAt: new Date(),
        })
        setSaved(true)
        setSavedDocId(docRef.id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function saveJournal() {
    if (!savedDocId) return
    setSaving(true)
    try {
      await updateDoc(doc(db, 'savedQuests', savedDocId), { journal, learned })
      setJournalSaved(true)
      setTimeout(() => setJournalSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (!quest) return (
    <div style={{ padding: 24 }}>
      <button className="btn-ghost" onClick={() => navigate('/')}>← Back</button>
      <p style={{ marginTop: 16, color: 'var(--text-2)' }}>Quest not found.</p>
    </div>
  )

  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(quest.title)}`

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="btn-ghost" onClick={() => navigate('/')}>← Back</button>
        <button
          className={saved ? 'btn-saved' : 'btn-save'}
          onClick={toggleSave}
          disabled={saving}
        >
          {saved ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      <div className="detail-hero">
        <span className="detail-emoji">{quest.emoji}</span>
        <h1 className="detail-title">{quest.title}</h1>
        <div className="detail-meta">
          <span className="quest-cost">{quest.estimatedCost}</span>
          <span className="quest-category">{quest.category}</span>
        </div>
      </div>

      <p className="detail-desc">{quest.description}</p>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-directions"
      >
        📍 Open in Google Maps
      </a>

      {saved && (
        <div className="journal-section">
          <h2 className="journal-title">Your Journal</h2>

          <div className="filter-group">
            <label className="filter-label">Notes about this place</label>
            <textarea
              className="input textarea"
              placeholder="What was it like? Would you go back?"
              value={journal}
              onChange={e => setJournal(e.target.value)}
              rows={4}
            />
          </div>

          <div className="filter-group" style={{ marginTop: 12 }}>
            <label className="filter-label">💡 What did you learn here?</label>
            <textarea
              className="input textarea"
              placeholder="A fun fact, a new perspective, something unexpected..."
              value={learned}
              onChange={e => setLearned(e.target.value)}
              rows={3}
            />
          </div>

          <button
            className="btn-primary"
            onClick={saveJournal}
            disabled={saving}
            style={{ marginTop: 12 }}
          >
            {journalSaved ? '✓ Saved!' : saving ? '...' : 'Save journal'}
          </button>
        </div>
      )}

      {!saved && (
        <p className="save-hint">Save this quest to unlock the journal ✦</p>
      )}
    </div>
  )
}