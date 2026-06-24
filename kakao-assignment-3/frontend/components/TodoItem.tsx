"use client";

import { useState, useRef, useEffect } from "react";
import { toggleTodo, editTodo, deleteTodo, toggleStar } from "../app/actions";
import { Todo } from "../types/todo";

export default function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.content || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = async () => {
    if (isPending) return;
    setIsPending(true);
    await toggleTodo(todo.id, todo.is_completed, todo.content);
    setIsPending(false);
  };

  const handleDelete = async () => {
    if (isPending) return;
    setIsPending(true);
    await deleteTodo(todo.id);
    setIsPending(false);
  };

  const handleStar = async () => {
    if (isPending) return;
    setIsPending(true);
    await toggleStar(todo.id, todo.is_starred);
    setIsPending(false);
  };

  const handleEditSubmit = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      alert("내용을 입력해주세요.");
      setEditText(todo.content);
      setIsEditing(false);
      return;
    }
    
    if (isPending) return;
    setIsPending(true);
    await editTodo(todo.id, trimmed, todo.is_completed);
    setIsPending(false);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setEditText(todo.content);
      setIsEditing(false);
    }
  };

  return (
    <li className={`flex items-center gap-3 p-4 bg-white border rounded-xl shadow-sm transition-all duration-200 group hover:shadow-md ${isPending ? 'opacity-50' : ''} ${
      todo.is_completed 
        ? "border-gray-200 bg-gray-50" 
        : todo.is_starred 
          ? "border-yellow-400 bg-yellow-50 border-2" 
          : "border-gray-100"
    }`}>
      <button 
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.is_completed 
            ? "bg-blue-600 border-blue-600 text-white" 
            : todo.is_starred
              ? "border-yellow-500 text-transparent hover:border-yellow-600"
              : "border-gray-300 text-transparent hover:border-blue-600"
        }`}
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
        </svg>
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-gray-50 border-b-2 border-blue-600 focus:outline-none px-1 py-0.5 text-gray-800"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleEditSubmit}
            disabled={isPending}
          />
        ) : (
          <p 
            className={`truncate transition-all ${
              todo.is_completed 
                ? "text-gray-400 line-through" 
                : todo.is_starred 
                  ? "text-yellow-900 font-bold" 
                  : "text-gray-800 font-medium"
            }`}
            onDoubleClick={() => !isPending && setIsEditing(true)}
          >
            {todo.content}
          </p>
        )}
      </div>

      <div className={`flex-shrink-0 flex items-center gap-1 transition-opacity ${todo.is_starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 focus-within:opacity-100'}`}>
        <button
          onClick={handleStar}
          disabled={isPending}
          className={`p-2 rounded-lg transition-colors ${
            todo.is_starred 
              ? "text-yellow-500 hover:bg-yellow-100" 
              : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50"
          }`}
          title={todo.is_starred ? "중요 표시 해제" : "중요 표시"}
        >
          <svg className={`w-5 h-5 ${todo.is_starred ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </button>

        {!isEditing && (
          <button
            onClick={() => !isPending && setIsEditing(true)}
            disabled={isPending}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
        
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}
