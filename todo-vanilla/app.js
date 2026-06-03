const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoCount = document.getElementById("todo-count");
const messageArea = document.getElementById("message-area");
const todoItemTemplate = document.getElementById("todo-item-template");
const filterButtons = document.querySelectorAll(".todo-filter-button");
const previousWeekButton = document.getElementById("previous-week-button");
const nextWeekButton = document.getElementById("next-week-button");
const weekRangeText = document.getElementById("week-range-text");
const weekDateGrid = document.getElementById("week-date-grid");

const TODO_STORAGE_KEY = "vanilla-todo-app-data";

let todos = [];
let nextTodoId = 1;
let activeFilter = "all";
let selectedDate = getTodayDateString();
let currentWeekAnchorDate = getMondayOfWeek(selectedDate);

// 오늘 날짜를 YYYY-MM-DD 형식으로 가져온다.
function getTodayDateString() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" });
}

// 날짜 문자열을 UTC 기준 Date 객체로 바꾼다.
function getUtcDateFromDateString(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// UTC Date 객체를 YYYY-MM-DD 문자열로 바꾼다.
function getDateStringFromUtcDate(date) {
  return date.toISOString().slice(0, 10);
}

// 기준 날짜에서 원하는 일수만큼 이동한 날짜 문자열을 만든다.
function getDateOffsetString(baseDateString, offsetDays) {
  const utcDate = getUtcDateFromDateString(baseDateString);
  utcDate.setUTCDate(utcDate.getUTCDate() + offsetDays);
  return getDateStringFromUtcDate(utcDate);
}

// 기준 날짜가 포함된 주의 월요일을 구한다.
function getMondayOfWeek(dateString) {
  const utcDate = getUtcDateFromDateString(dateString);
  const dayOfWeek = utcDate.getUTCDay();
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  utcDate.setUTCDate(utcDate.getUTCDate() + offsetToMonday);
  return getDateStringFromUtcDate(utcDate);
}

// 날짜를 화면에 보여주기 좋은 긴 형식으로 변환한다.
function formatDateForDisplay(dateString) {
  const date = getUtcDateFromDateString(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

// 주간 뷰의 날짜 칩에서 쓸 짧은 날짜 표현을 만든다.
function formatShortDateForWeek(dateString) {
  const date = getUtcDateFromDateString(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(date);
}

// 주간 뷰에서 쓸 요일 라벨을 만든다.
function getDayLabel(dateString) {
  const date = getUtcDateFromDateString(dateString);
  return new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(date);
}

// 현재 선택된 주의 범위를 텍스트로 보여준다.
function getWeekRangeText() {
  const weekEndDate = getDateOffsetString(currentWeekAnchorDate, 6);
  return `${formatDateForDisplay(currentWeekAnchorDate)} - ${formatDateForDisplay(weekEndDate)}`;
}

// 입력 검증이나 저장 상태를 안내 메시지로 보여준다.
function showMessage(message) {
  messageArea.textContent = message;
}

// 메시지 영역을 비운다.
function clearMessage() {
  messageArea.textContent = "";
}

// Todo 목록을 localStorage에 JSON으로 저장한다.
function saveTodosToStorage() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

// localStorage에서 Todo 목록을 불러온다.
function loadTodosFromStorage() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);
  if (!savedTodos) {
    return;
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);
    if (!Array.isArray(parsedTodos)) {
      return;
    }

    todos = parsedTodos.map((todo) => ({
      id: Number(todo.id),
      text: String(todo.text ?? ""),
      date: String(todo.date ?? getTodayDateString()),
      completed: Boolean(todo.completed),
      isEditing: false,
    }));

    nextTodoId = todos.reduce((maximumId, todo) => Math.max(maximumId, todo.id), 0) + 1;
  } catch {
    todos = [];
    nextTodoId = 1;
  }
}

// 특정 날짜에 속한 Todo만 반환한다.
function getTodosForDate(dateString) {
  return todos.filter((todo) => todo.date === dateString);
}

// 선택된 날짜와 상태 필터를 함께 적용해 표시할 Todo만 골라낸다.
function getFilteredTodos() {
  return todos.filter((todo) => {
    const matchesSelectedDate = todo.date === selectedDate;
    const matchesStatusFilter =
      activeFilter === "all" ||
      (activeFilter === "active" && !todo.completed) ||
      (activeFilter === "completed" && todo.completed);

    return matchesSelectedDate && matchesStatusFilter;
  });
}

// 현재 보이는 Todo 개수를 갱신한다.
function updateTodoCount() {
  todoCount.textContent = `${getFilteredTodos().length}개`;
}

// 선택된 상태 필터 버튼의 활성 스타일을 갱신한다.
function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

// 주간 뷰의 날짜 버튼 한 개를 만든다.
function createWeekDateButton(dateString) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "week-date-button";
  button.dataset.date = dateString;
  button.innerHTML = `
    <span class="week-day-name">${getDayLabel(dateString)}</span>
    <span class="week-day-number">${formatShortDateForWeek(dateString)}</span>
    <span class="week-todo-count">${getTodosForDate(dateString).length}개</span>
  `;

  if (dateString === selectedDate) {
    button.classList.add("is-selected");
  }

  if (dateString === getTodayDateString()) {
    button.classList.add("is-today");
  }

  button.setAttribute("aria-label", `${formatDateForDisplay(dateString)} 선택`);
  return button;
}

// 주간 날짜 영역을 다시 그린다.
function renderWeekView() {
  weekRangeText.textContent = getWeekRangeText();
  weekDateGrid.innerHTML = "";

  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const dateString = getDateOffsetString(currentWeekAnchorDate, dayOffset);
    weekDateGrid.appendChild(createWeekDateButton(dateString));
  }
}

// Todo 한 개를 화면에 그릴 DOM 조각을 만든다.
function createTodoElement(todo) {
  const fragment = todoItemTemplate.content.cloneNode(true);
  const todoItem = fragment.querySelector(".todo-item");
  const todoContent = fragment.querySelector(".todo-content");
  const todoText = fragment.querySelector(".todo-text");
  const todoDateBadge = fragment.querySelector(".todo-date-badge");
  const completeButton = fragment.querySelector(".complete-button");

  todoItem.dataset.id = String(todo.id);
  todoItem.classList.toggle("completed", todo.completed);
  todoItem.classList.toggle("is-editing", todo.isEditing);

  if (todo.isEditing) {
    todoContent.innerHTML = "";
    const editInput = document.createElement("input");
    editInput.className = "todo-edit-input";
    editInput.type = "text";
    editInput.value = todo.text;
    editInput.setAttribute("aria-label", "Todo 수정 입력창");
    todoContent.appendChild(editInput);
  } else {
    todoText.textContent = todo.text;
    todoDateBadge.textContent = formatDateForDisplay(todo.date);
  }

  completeButton.textContent = todo.completed ? "미완료" : "완료";
  completeButton.setAttribute(
    "aria-label",
    todo.completed ? "이 Todo를 미완료로 변경" : "이 Todo를 완료로 변경"
  );

  return fragment;
}

// Todo 목록과 주간 뷰를 다시 렌더링한다.
function renderTodos() {
  todoList.innerHTML = "";

  getFilteredTodos().forEach((todo) => {
    todoList.appendChild(createTodoElement(todo));
  });

  updateTodoCount();

  const editingInput = todoList.querySelector(".todo-edit-input");
  if (editingInput) {
    editingInput.focus();
    editingInput.setSelectionRange(editingInput.value.length, editingInput.value.length);
  }

  renderWeekView();
}

// 새 Todo를 현재 선택된 날짜에 추가한다.
function addTodo(text) {
  todos.unshift({
    id: nextTodoId++,
    text,
    date: selectedDate,
    completed: false,
    isEditing: false,
  });

  saveTodosToStorage();
  renderTodos();
}

// 입력값이 비어 있지 않을 때만 Todo를 생성한다.
function createTodo() {
  const enteredText = todoInput.value.trim();

  if (!enteredText) {
    showMessage("Todo 내용을 입력해 주세요.");
    todoInput.focus();
    return;
  }

  clearMessage();
  addTodo(enteredText);
  todoInput.value = "";
  todoInput.focus();
}

// Todo를 삭제하고 저장한다.
function deleteTodo(todoId) {
  todos = todos.filter((todo) => todo.id !== todoId);
  clearMessage();
  saveTodosToStorage();
  renderTodos();
}

// Todo의 완료 상태를 뒤집고 저장한다.
function toggleTodoComplete(todoId) {
  todos = todos.map((todo) => {
    if (todo.id !== todoId) {
      return todo;
    }

    return {
      ...todo,
      completed: !todo.completed,
    };
  });

  clearMessage();
  saveTodosToStorage();
  renderTodos();
}

// 수정 중인 Todo를 하나만 활성화한다.
function startEditingTodo(todoId) {
  todos = todos.map((todo) => ({
    ...todo,
    isEditing: todo.id === todoId ? !todo.isEditing : false,
  }));

  clearMessage();
  renderTodos();
}

// 수정된 내용을 저장하고 편집 상태를 종료한다.
function saveEditedTodo(todoId, editedText) {
  const trimmedText = editedText.trim();

  if (!trimmedText) {
    showMessage("수정할 내용을 입력해 주세요.");
    return;
  }

  clearMessage();
  todos = todos.map((todo) => {
    if (todo.id !== todoId) {
      return todo;
    }

    return {
      ...todo,
      text: trimmedText,
      isEditing: false,
    };
  });

  saveTodosToStorage();
  renderTodos();
}

// 상태 필터를 바꾸고 목록을 다시 그린다.
function setActiveFilter(filterName) {
  activeFilter = filterName;
  updateFilterButtons();
  renderTodos();
}

// 선택된 날짜를 바꾸고 화면을 갱신한다.
function setSelectedDate(dateString) {
  selectedDate = dateString;
  renderTodos();
}

// 현재 보고 있는 주를 이전/다음 주로 이동한다.
function moveWeek(offsetWeeks) {
  currentWeekAnchorDate = getDateOffsetString(currentWeekAnchorDate, offsetWeeks * 7);
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createTodo();
});

todoList.addEventListener("click", (event) => {
  const todoItem = event.target.closest(".todo-item");
  if (!todoItem) {
    return;
  }

  const todoId = Number(todoItem.dataset.id);

  if (event.target.closest(".edit-button")) {
    startEditingTodo(todoId);
    return;
  }

  if (event.target.closest(".complete-button")) {
    toggleTodoComplete(todoId);
    return;
  }

  if (event.target.closest(".delete-button")) {
    deleteTodo(todoId);
  }
});

todoList.addEventListener("keydown", (event) => {
  if (!event.target.classList.contains("todo-edit-input") || event.key !== "Enter") {
    return;
  }

  const todoItem = event.target.closest(".todo-item");
  const todoId = Number(todoItem.dataset.id);
  saveEditedTodo(todoId, event.target.value);
});

todoList.addEventListener("focusout", (event) => {
  if (!event.target.classList.contains("todo-edit-input")) {
    return;
  }

  const todoItem = event.target.closest(".todo-item");
  const todoId = Number(todoItem.dataset.id);
  saveEditedTodo(todoId, event.target.value);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter);
  });
});

weekDateGrid.addEventListener("click", (event) => {
  const dateButton = event.target.closest(".week-date-button");
  if (!dateButton) {
    return;
  }

  setSelectedDate(dateButton.dataset.date);
});

previousWeekButton.addEventListener("click", () => {
  moveWeek(-1);
});

nextWeekButton.addEventListener("click", () => {
  moveWeek(1);
});

loadTodosFromStorage();
weekRangeText.textContent = getWeekRangeText();
updateFilterButtons();
renderTodos();
