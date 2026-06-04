// 시연 1: Lifting State Up
import { useState } from "react";
import ShoppingHeader from "../shared/components/ShoppingHeader";
import ProductList from "../shared/components/ProductList";
import { PRODUCTS } from "../shared/data/products";
import "@/App.css";

export default function ShoppingApp() {
  // 두 자식이 공유해야 할 상태를 공통 부모가 소유
  const [cartCount, setCartCount] = useState(0);
  const handleAddToCart = () => setCartCount((c) => c + 1);

  return (
    <div className="demo-app">
      {/* Header 에게는 '현재 개수'를 내려줌 */}
      <ShoppingHeader count={cartCount} />
      {/* ProductList 에게는 개수를 올릴 '함수'를 내려줌 */}
      <ProductList products={PRODUCTS} onAdd={handleAddToCart} />
    </div>
  );
}
