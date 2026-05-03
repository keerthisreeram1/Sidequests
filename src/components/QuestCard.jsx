export default function QuestCard({ quest, index }) {
  return (
    <div className="quest-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="quest-top">
        <span className="quest-emoji">{quest.emoji}</span>
        <span className="quest-cost">{quest.estimatedCost}</span>
      </div>
      <h3 className="quest-title">{quest.title}</h3>
      <p className="quest-desc">{quest.description}</p>
      <span className="quest-category">{quest.category}</span>
    </div>
  )
}
