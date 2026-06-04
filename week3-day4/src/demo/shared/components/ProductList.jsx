export default function ProductList({ products, onAdd }) {
  return (
    <ul className="product-list">
      {products.map(product => (
        <li key={product.id} className="product-item">
          <span>{product.name} — {product.price.toLocaleString()}원</span>
          <button className="add-btn" onClick={onAdd}>담기</button>
        </li>
      ))}
    </ul>
  );
}
