// 시연 2: 로딩 · 에러 · 빈 상태 처리
import { useState, useEffect } from "react";
import ShoppingHeader from "../shared/components/ShoppingHeader";
import ProductList from "../shared/components/ProductList";
import Loading from "../shared/components/Loading";
import ErrorMessage from "../shared/components/ErrorMessage";
import EmptyState from "../shared/components/EmptyState";
import { PRODUCTS } from "../shared/data/products";
import "@/App.css";

export default function ShoppingApp() {
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchIndex, setFetchIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 1000));
        if (Math.random() < 0.3) throw new Error("서버 응답 오류 (시뮬레이션)");
        setProducts(PRODUCTS);
      } catch (err) {
        setError(
          err.message || "상품을 불러오지 못했습니다. 다시 시도해 주세요.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [fetchIndex]);

  const handleAddToCart = () => setCartCount((c) => c + 1);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setFetchIndex((i) => i + 1);
  };

  const renderContent = () => {
    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage message={error} onRetry={handleRetry} />;
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
