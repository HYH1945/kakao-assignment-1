import { NextResponse } from "next/server";
import { createTodo, toggleTodo, editTodo, deleteTodo, getTodos } from "../../actions";

export async function GET() {
  try {
    // 1. Create
    await createTodo("Test Integration Task", "2026-06-25");
    
    // 2. Fetch to get ID
    const todos = await getTodos();
    const target = todos.find((t: any) => t.content === "Test Integration Task");
    
    if (target) {
      // 3. Toggle (PUT)
      await toggleTodo(target.id, false, target.content);
      
      // 4. Edit (PUT)
      await editTodo(target.id, "Edited Integration Task", true);
      
      // 5. Delete (DELETE)
      await deleteTodo(target.id);
      
      return NextResponse.json({ success: true, message: "All Server Actions (Create, Toggle, Edit, Delete) executed successfully!" });
    } else {
      return NextResponse.json({ success: false, message: "Failed to find created todo." }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
