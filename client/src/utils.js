const PLACEHOLDER = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"><rect fill="#e8e8e8" width="200" height="150"/><text x="100" y="80" text-anchor="middle" fill="#999" font-size="14">No image</text></svg>'
)

export function formatPrice(price, currency) {
  return `${currency} ${Number(price).toFixed(2)}`
}

export function getDiscountedPrice(variant) {
  const price = Number(variant.selling_price)
  if (variant.discount_perc) return price * (1 - Number(variant.discount_perc) / 100)
  if (variant.discount_flat_amt) return price - Number(variant.discount_flat_amt)
  return price
}

export function variantToCartItem(product, variant, detail) {
  const photos = variant.variant_album?.length
    ? variant.variant_album
    : detail.product_photos_all || []
  return {
    productId: product.product_id,
    variantId: variant.product_variant_id,
    productName: detail.product_name || product.product_name,
    variantName: variant.product_variant_name,
    price: getDiscountedPrice(variant),
    originalPrice: Number(variant.selling_price),
    currency: variant.currency,
    image: photos[0]?.photo_url || product.productpic || PLACEHOLDER,
    available: variant.product_availability,
  }
}

export { PLACEHOLDER }
