const CRITERIA = [
  { id: 'price', label: 'Minimum Selling Price' },
  { id: 'availability', label: 'Availability' },
  { id: 'category', label: 'Category' },
]

export default function SortControls({ sortOrder, onChange }) {
  const addCriterion = (id) => {
    if (!sortOrder.includes(id)) onChange([...sortOrder, id])
  }

  const removeCriterion = (id) => onChange(sortOrder.filter((c) => c !== id))

  const moveUp = (idx) => {
    if (idx === 0) return
    const next = [...sortOrder]
    ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
    onChange(next)
  }

  const available = CRITERIA.filter((c) => !sortOrder.includes(c.id))

  return (
    <div className="sort-controls">
      <h3>Sort by (priority order)</h3>
      {sortOrder.length === 0 && <p className="sort-hint">Add criteria below to sort the menu.</p>}
      <ul className="sort-list">
        {sortOrder.map((id, idx) => {
          const c = CRITERIA.find((x) => x.id === id)
          return (
            <li key={id}>
              <span>{idx + 1}. {c.label}</span>
              <span className="sort-actions">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0}>↑</button>
                <button type="button" onClick={() => removeCriterion(id)}>×</button>
              </span>
            </li>
          )
        })}
      </ul>
      {available.length > 0 && (
        <select onChange={(e) => { if (e.target.value) { addCriterion(e.target.value); e.target.value = '' } }} defaultValue="">
          <option value="">+ Add sort criterion</option>
          {available.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      )}
    </div>
  )
}

export function sortItems(items, sortOrder) {
  if (!sortOrder.length) return items
  return [...items].sort((a, b) => {
    for (const criterion of sortOrder) {
      let cmp = 0
      if (criterion === 'price') cmp = a.selling_price - b.selling_price
      else if (criterion === 'availability') cmp = (b.product_availability ? 1 : 0) - (a.product_availability ? 1 : 0)
      else if (criterion === 'category') cmp = (a.cataloguename || '').localeCompare(b.cataloguename || '')
      if (cmp !== 0) return cmp
    }
    return 0
  })
}
