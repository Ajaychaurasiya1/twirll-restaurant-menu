import { useState } from 'react'
import { formatPrice, getDiscountedPrice, PLACEHOLDER } from '../utils'

export default function VariantModal({ product, detail, onClose, onAdd }) {
  const [selected, setSelected] = useState(null)
  const variants = detail?.product_variant_inventories || []

  const getImage = (variant) => {
    const variantImg = variant.variant_album?.[0]?.photo_url
    if (variantImg) return variantImg
    const productImg = detail.product_photos_all?.[0]?.photo_url
    if (productImg) return productImg
    return product.productpic || PLACEHOLDER
  }

  const handleAdd = () => {
    if (!selected) return
    onAdd(selected)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{detail.product_name || product.product_name}</h2>
        <p className="modal-desc">{product.item_short_description}</p>
        <div className="variant-list">
          {variants.map((v) => {
            const discounted = getDiscountedPrice(v)
            const hasDiscount = discounted < Number(v.selling_price)
            return (
              <label
                key={v.product_variant_id}
                className={`variant-option ${!v.product_availability ? 'unavailable' : ''} ${selected?.product_variant_id === v.product_variant_id ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="variant"
                  disabled={!v.product_availability}
                  checked={selected?.product_variant_id === v.product_variant_id}
                  onChange={() => setSelected(v)}
                />
                <img src={getImage(v)} alt={v.product_variant_name} />
                <div className="variant-info">
                  <strong>{v.product_variant_name}</strong>
                  {v.product_variant_description && <p>{v.product_variant_description}</p>}
                  <span className="price">
                    {hasDiscount && (
                      <s>{formatPrice(v.selling_price, v.currency)}</s>
                    )}{' '}
                    {formatPrice(discounted, v.currency)}
                  </span>
                  <span className={`status ${v.product_availability ? 'available' : 'unavailable'}`}>
                    {v.product_availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </label>
            )
          })}
        </div>
        <button
          className="btn btn-primary"
          disabled={!selected || !selected.product_availability}
          onClick={handleAdd}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
