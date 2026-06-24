"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const FILTER_TYPES = {
  ALL: "ALL",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
};

export default function FilterTabs() {
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || FILTER_TYPES.ALL;

  const tabs = [
    { id: FILTER_TYPES.ALL, label: "전체" },
    { id: FILTER_TYPES.ACTIVE, label: "진행중" },
    { id: FILTER_TYPES.COMPLETED, label: "완료" },
  ];

  return (
    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg mb-4">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.id;
        // 기존 쿼리 파라미터(date 등)를 유지하면서 filter만 변경
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set("filter", tab.id);

        return (
          <Link
            key={tab.id}
            href={`?${newParams.toString()}`}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all text-center ${
              isActive
                ? "bg-white text-blue-600 shadow-sm border-b-2 border-blue-500 font-bold"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
