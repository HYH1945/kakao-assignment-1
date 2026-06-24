"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    // 300ms 디바운싱: 사용자가 입력을 멈춘 후 300ms 뒤에 한 번만 실행됨
    const handler = setTimeout(() => {
      const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (searchTerm) {
        currentParams.set("search", searchTerm);
      } else {
        currentParams.delete("search");
      }
      
      // 검색어가 바뀌었을 때만 push (무한 렌더 방지)
      if (searchParams.get("search") !== searchTerm && !(searchParams.get("search") === null && searchTerm === "")) {
          router.push(`?${currentParams.toString()}`);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, router, searchParams]);

  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm text-black"
        placeholder="할 일을 검색하세요..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
