export interface Todo {
  id: number;
  content: string;
  is_completed: boolean;
  is_starred: boolean;
  target_date: string | null;
}
