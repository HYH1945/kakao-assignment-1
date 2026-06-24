"use server";

import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function getTodos() {
  try {
    const res = await fetch(`${API_BASE}/todos`, { cache: "no-store" });
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
