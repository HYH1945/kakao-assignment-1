"use server";

import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getTodos(filter: string = "ALL", search: string = "", date: string = "", skip: number = 0, limit: number = 20) {
  try {
    let url = `${API_BASE}/todos?skip=${skip}&limit=${limit}&`;
    
    // 필터 조건 추가
    if (filter === "ACTIVE") url += "is_completed=false&";
    else if (filter === "COMPLETED") url += "is_completed=true&";
    
    // 검색 조건 추가
    if (search) url += `search=${encodeURIComponent(search)}&`;

    // 날짜 조건 추가
    if (date) url += `target_date=${encodeURIComponent(date)}&`;
    
    // 마지막 '&' 또는 '?' 제거
    if (url.endsWith("&") || url.endsWith("?")) {
      url = url.slice(0, -1);
    }
    
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch todos");
    return await res.json();
  } catch (error) {
    console.error("Backend connection error:", error);
    return [];
  }
}

export async function createTodo(content: string, targetDate: string) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, target_date: targetDate, is_completed: false }),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  revalidatePath("/todos");
}

export async function toggleTodo(id: number, currentStatus: boolean, content: string) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, is_completed: !currentStatus }),
  });
  if (!res.ok) throw new Error("Failed to toggle todo");
  revalidatePath("/todos");
}

export async function toggleStar(id: number, currentStarStatus: boolean) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_starred: !currentStarStatus }),
  });
  if (!res.ok) throw new Error("Failed to toggle star");
  revalidatePath("/todos");
}

export async function editTodo(id: number, content: string, currentStatus: boolean) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, is_completed: currentStatus }),
  });
  if (!res.ok) throw new Error("Failed to edit todo");
  revalidatePath("/todos");
}

export async function deleteTodo(id: number) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete todo");
  revalidatePath("/todos");
}
