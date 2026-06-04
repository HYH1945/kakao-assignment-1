export default function ShoppingHeader({ count }) {
  return (
    <header className="shop-header">
      <h1>🛍 쇼핑몰</h1>
      <span className="cart-badge">🛒 {count}개</span>
    </header>
  );
}
