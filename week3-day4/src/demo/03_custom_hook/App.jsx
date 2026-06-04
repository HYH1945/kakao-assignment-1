// 시연 3: Custom Hook
// 비동기 로딩 로직(useProducts)만 훅으로 분리하고,
// 단순한 카운터 상태는 컴포넌트에 직접 둔다.
import { useState } from "react";
import { useProducts } from "./hooks/useProducts";
import ShoppingHeader from "../shared/components/ShoppingHeader";
import ProductList from "../shared/components/ProductList";
import Loading from "../shared/components/Loading";
import ErrorMessage from "../shared/components/ErrorMessage";
import EmptyState from "../shared/components/EmptyState";
import "@/App.css";

export default function ShoppingApp() {
  const { products, isLoading, error, reload } = useProducts();
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => setCartCount((c) => c + 1);

  const renderContent = () => {
    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage message={error} onRetry={reload} />;
    if (products.length === 0) return <EmptyState />;
    return <ProductList products={products} onAdd={handleAddToCart} />;
  };

  return (
    <div className="demo-app">
      <ShoppingHeader count={cartCount} />
      <div className="demo-content">{renderContent()}</div>
    </div>
  );
}
