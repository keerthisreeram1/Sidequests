const VIBES = ['Outdoors', 'Food & Drink', 'Arts', 'Chill', 'Active', 'Hidden Gem']
const GROUP_SIZES = [
  { value: 'solo', label: 'Solo' },
  { value: 'couple', label: 'Couple' },
  { value: 'small group', label: 'Small group' },
  { value: 'large group', label: 'Large group' },
]

export default function Filters({ filters, onChange }) {
  function update(key, value) {
    onChange(prev => ({ ...prev, [key]: value }))
  }

  function toggleVibe(v) {
    onChange(prev => ({
      ...prev,
      vibe: prev.vibe.includes(v) ? prev.vibe.filter(x => x !== v) : [...prev.vibe, v],
    }))
  }

  return (
    <div className="filters">

      <div className="filter-row">
        <div className="filter-group">
          <label className="filter-label">Budget <span className="filter-value">${filters.budget}</span></label>
          <input
            type="range" min={0} max={100} step={5}
            value={filters.budget}
            onChange={e => update('budget', Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Distance <span className="filter-value">{filters.distance} mi</span></label>
          <input
            type="range" min={1} max={25} step={1}
            value={filters.distance}
            onChange={e => update('distance', Number(e.target.value))}
            className="slider"
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Group</label>
        <div className="chip-row">
          {GROUP_SIZES.map(g => (
            <button
              key={g.value}
              className={filters.groupSize === g.value ? 'chip active' : 'chip'}
              onClick={() => update('groupSize', g.value)}
            >{g.label}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Vibe</label>
        <div className="chip-row">
          {VIBES.map(v => (
            <button
              key={v}
              className={filters.vibe.includes(v) ? 'chip active' : 'chip'}
              onClick={() => toggleVibe(v)}
            >{v}</button>
          ))}
        </div>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label className="filter-label">Special needs</label>
          <div className="chip-row">
            <button
              className={filters.kids ? 'chip active' : 'chip'}
              onClick={() => update('kids', !filters.kids)}
            >👶 Kids</button>
            <button
              className={filters.elderly ? 'chip active' : 'chip'}
              onClick={() => update('elderly', !filters.elderly)}
            >🧓 Elderly</button>
          </div>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Mood <span className="filter-hint">(optional)</span></label>
        <input
          className="input"
          placeholder="e.g. adventurous, chill, hungry, spontaneous..."
          value={filters.mood}
          onChange={e => update('mood', e.target.value)}
        />
      </div>

    </div>
  )
}
