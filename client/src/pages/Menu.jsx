import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMenuItems, fetchProductDetail } from '../api/menu'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import VariantModal from '../components/VariantModal'
import SortControls, { sortItems } from '../components/SortControls'
import { formatPrice, variantToCartItem, PLACEHOLDER } from '../utils'

export default function Menu() {
  const { user, logout } = useAuth()
  const { addItem, totalCount } = useCart()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalProduct, setModalProduct] = useState(null)
  const [modalDetail, setModalDetail] = useState(null)
  const [sortOrder, setSortOrder] = useState([])
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    fetchMenuItems()
      .then(setItems)
      .catch(() => setError('Failed to load menu'))
      .finally(() => setLoading(false))
  }, [])

  const handleItemClick = async (product) => {
    if (!product.product_availability) return

    if (Number(product.total_variants) === 1) {
      setAddingId(product.product_id)
      try {
        const detail = await fetchProductDetail(product.product_id)
        const variant = detail.product_variant_inventories?.[0]
        if (variant?.product_availability) {
          addItem(variantToCartItem(product, variant, detail))
        }
      } catch {
        setError('Failed to add item')
      } finally {
        setAddingId(null)
      }
      return
    }

    try {
      const detail = await fetchProductDetail(product.product_id)
      setModalProduct(product)
      setModalDetail(detail)
    } catch {
      setError('Failed to load product details')
    }
  }

  const sorted = sortItems(items, sortOrder)

  return (
    <div className="page menu-page">
      <header className="menu-header">
        <Link to="/" className="back-link">← Home</Link>
        <h1>Menu</h1>
        <div className="header-right">
          {user ? (
            <span className="user-badge">
              {user.name}
              <button type="button" className="link-btn" onClick={logout}>Logout</button>
            </span>
          ) : (
            <Link to="/login">Login</Link>
          )}
          <span className="cart-badge" title="Items in cart">{totalCount}</span>
        </div>
      </header>

      <SortControls sortOrder={sortOrder} onChange={setSortOrder} />

      {loading && <p>Loading menu...</p>}
      {error && <p className="error">{error}</p>}

      <div className="menu-grid">
        {sorted.map((item) => (
          <article
            key={item.product_id}
            className={`menu-card ${!item.product_availability ? 'out-of-stock' : ''}`}
            onClick={() => handleItemClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleItemClick(item)}
          >
            <img
              src={item.productpic || PLACEHOLDER}
              alt={item.product_name}
              onError={(e) => { e.target.src = PLACEHOLDER }}
            />
            <div className="card-body">
              <h3>{item.product_name}</h3>
              {item.item_short_description && <p>{item.item_short_description}</p>}
              <p className="price">
                Starting from {formatPrice(item.selling_price, item.currency)}
              </p>
              <span className={`status ${item.product_availability ? 'available' : 'unavailable'}`}>
                {item.product_availability ? 'Available' : 'Unavailable'}
              </span>
              {Number(item.total_variants) === 1 && item.product_availability && (
                <span className="quick-add">
                  {addingId === item.product_id ? 'Adding...' : 'Click to add'}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {modalProduct && modalDetail && (
        <VariantModal
          product={modalProduct}
          detail={modalDetail}
          onClose={() => { setModalProduct(null); setModalDetail(null) }}
          onAdd={(variant) => addItem(variantToCartItem(modalProduct, variant, modalDetail))}
        />
      )}
    </div>
  )
}
