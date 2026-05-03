import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import Filters from '../components/Filters'
import QuestCard from '../components/QuestCard'

export default function Home() {
  const { user } = useAuth()
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [location, setLocation] = useState(null)
  const [locationName, setLocationName] = useState('')
  const [filters, setFilters] = useState({
    budget: 20,
    distance: 5,
    groupSize: 'solo',
    kids: false,
    elderly: false,
    vibe: [],
    mood: '',
  })

  async function getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject('Geolocation not supported')
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  async function findQuests() {
    setError('')
    setLoading(true)
    setQuests([])

    try {
      const pos = await getLocation()
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      setLocation({ lat, lon })

      // Reverse geocode for city name
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      )
      const geoData = await geoRes.json()
      const city = geoData.address?.city || geoData.address?.town || geoData.address?.suburb || 'your area'
      setLocationName(city)

      const prompt = buildPrompt(lat, lon, city, filters)

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1000,
          system: `You are SideQuests, an app that suggests fun local activities. 
Always respond with ONLY a valid JSON array of exactly 5 quest objects.
No markdown, no explanation, just the raw JSON array.
Each object must have: title (string), emoji (string), description (string, 1-2 sentences), estimatedCost (string like "Free" or "~$8"), category (string).`,
          messages: [{ role: 'user', content: prompt }],
        }),
      })

      const data = await res.json()
      const text = data.content?.[0]?.text || '[]'
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setQuests(parsed)
    } catch (err) {
      console.error(err)
      if (err.code === 1) {
        setError('Location access denied. Please allow location in your browser.')
      } else {
        setError('Something went wrong. Check your API key and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  function buildPrompt(lat, lon, city, f) {
    const vibes = f.vibe.length > 0 ? f.vibe.join(', ') : 'any'
    const extras = []
    if (f.kids) extras.push('must be kid-friendly')
    if (f.elderly) extras.push('must be elderly-friendly and accessible')
    if (f.mood) extras.push(`current mood: ${f.mood}`)

    return `Suggest 5 real side quests near ${city} (lat: ${lat}, lon: ${lon}).

Constraints:
- Budget: under $${f.budget} per person
- Distance: within ${f.distance} miles
- Group: ${f.groupSize}
- Vibe: ${vibes}
${extras.map(e => `- ${e}`).join('\n')}

Return JSON array only. Example format:
[{"title":"Canyon Hike","emoji":"🥾","description":"A scenic 2-mile loop with views.","estimatedCost":"Free","category":"Outdoors"}]`
  }

  return (
    <div className="home">
      <header className="top-bar">
        <div className="top-bar-left">
          <span className="logo-mark small">◈</span>
          <span className="logo-text small">SideQuests</span>
        </div>
        <div className="top-bar-right">
          <span className="user-name">{user?.displayName || user?.email}</span>
          <button className="btn-ghost" onClick={() => signOut(auth)}>Sign out</button>
        </div>
      </header>

      <main className="main-content">
        <div className="hero">
          <h2 className="hero-title">What's the plan?</h2>
          {locationName && <p className="location-pill">📍 {locationName}</p>}
        </div>

        <Filters filters={filters} onChange={setFilters} />

        <button className="btn-primary find-btn" onClick={findQuests} disabled={loading}>
          {loading ? (
            <span className="loading-row"><span className="spinner-small" /> Finding quests...</span>
          ) : (
            '✦ Find Side Quests'
          )}
        </button>

        {error && <p className="error-msg center">{error}</p>}

        {quests.length > 0 && (
          <div className="quests-section">
            <p className="quests-label">{quests.length} quests found nearby</p>
            <div className="quests-grid">
              {quests.map((q, i) => <QuestCard key={i} quest={q} index={i} />)}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
