import { useState, useEffect } from "react";
import { PRODUCTS } from "../../shared/data/products";

// 상품 목록 로딩 담당: 상품 데이터, 로딩/에러 상태, 재시도 함수를 제공합니다.
export function useProducts() {
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

  const reload = () => {
    setIsLoading(true);
    setError(null);
    setFetchIndex((i) => i + 1);
  };

  return { products, isLoading, error, reload };
}
