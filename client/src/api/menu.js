export async function fetchMenuItems() {
  const res = await fetch('/api/menu')
  if (!res.ok) throw new Error('Failed to load menu')
  return res.json()
}

export async function fetchProductDetail(productId) {
  const res = await fetch(`/api/menu/${productId}`)
  if (!res.ok) throw new Error('Failed to load product')
  const data = await res.json()
  return Array.isArray(data) ? data[0] : data
}
