import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const prevUserRef = useRef(user)
  const skipSave = useRef(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    skipSave.current = true
    const wasLoggedIn = prevUserRef.current != null
    prevUserRef.current = user

    if (user) {
      const saved = localStorage.getItem(`cart_${user.id}`)
      setItems(saved ? JSON.parse(saved) : [])
    } else if (wasLoggedIn) {
      setItems([])
    } else {
      const saved = localStorage.getItem('cart_guest')
      setItems(saved ? JSON.parse(saved) : [])
    }
  }, [user])

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false
      return
    }
    const key = user ? `cart_${user.id}` : 'cart_guest'
    localStorage.setItem(key, JSON.stringify(items))
  }, [items, user])

  const addItem = (item) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 }
        return next
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItem = (productId, variantId) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
    )
  }

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, totalCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
